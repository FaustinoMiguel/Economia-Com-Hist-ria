import AsyncStorage from '@react-native-async-storage/async-storage'
import Constants from 'expo-constants'

const API_PORT = 5000

// Resolve a base da API:
//  1) EXPO_PUBLIC_API_URL, se definido (.env)
//  2) Em desenvolvimento, o IP da máquina onde o Metro corre (do dispositivo/emulador
//     o backend não está em "localhost"); usa esse IP com a porta do backend.
//  3) Fallback para localhost.
function resolveApiBase(): string {
  if (process.env.EXPO_PUBLIC_API_URL) return process.env.EXPO_PUBLIC_API_URL

  const hostUri =
    Constants.expoConfig?.hostUri ??
    // compatibilidade com versões antigas do Expo
    (Constants as any).manifest?.debuggerHost ??
    (Constants as any).manifest2?.extra?.expoGo?.debuggerHost

  const host = hostUri ? String(hostUri).split(':')[0] : 'localhost'
  return `http://${host}:${API_PORT}/api`
}

const API_BASE = resolveApiBase()

const TOKEN_KEY = 'authToken'
const USER_KEY = 'currentUser'

export async function getToken(): Promise<string | null> {
  return AsyncStorage.getItem(TOKEN_KEY)
}
export async function setToken(token: string): Promise<void> {
  await AsyncStorage.setItem(TOKEN_KEY, token)
}
export async function removeToken(): Promise<void> {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY])
}

export async function getStoredUser<T = unknown>(): Promise<T | null> {
  const raw = await AsyncStorage.getItem(USER_KEY)
  return raw ? (JSON.parse(raw) as T) : null
}
export async function setStoredUser(user: unknown): Promise<void> {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user))
}

type ApiOptions = Omit<RequestInit, 'body'> & {
  json?: unknown
  anonymous?: boolean
}

export async function apiRequest<T>(path: string, options: ApiOptions = {}): Promise<T> {
  const headers = new Headers(options.headers as HeadersInit | undefined)

  if (options.json !== undefined) {
    headers.set('Content-Type', 'application/json')
  }
  if (!options.anonymous) {
    const token = await getToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const response = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
    body: options.json !== undefined ? JSON.stringify(options.json) : undefined,
  })

  if (response.status === 401) {
    await removeToken()
  }

  const contentType = response.headers.get('content-type') ?? ''
  const data = contentType.includes('application/json')
    ? await response.json()
    : await response.text()

  if (!response.ok) {
    const message =
      typeof data === 'object' && data && 'message' in data
        ? String((data as { message?: string }).message ?? 'Pedido falhou')
        : 'Pedido falhou'
    throw new Error(message)
  }

  return data as T
}

export function getApiBase(): string {
  return API_BASE
}

// Compatibilidade com a base inicial
export async function getHealth() {
  return apiRequest('/stats', { anonymous: true })
}
