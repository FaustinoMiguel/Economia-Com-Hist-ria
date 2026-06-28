import React, { createContext, useContext, useEffect, useState, type ReactNode } from 'react'
import {
  apiRequest,
  getStoredUser,
  getToken,
  removeToken,
  setStoredUser,
  setToken,
} from '../services/api'

export interface User {
  id: number
  name: string
  email: string
  province?: string | null
  institution?: string | null
  course?: string | null
  role: 'visitante' | 'subscrito' | 'admin' | 'superadmin'
  isAdmin: boolean
}

interface AuthContextType {
  user: User | null
  loading: boolean
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (
    name: string,
    email: string,
    password: string,
    province?: string,
  ) => Promise<boolean>
  logout: () => Promise<void>
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

function normalizeUser(raw: Record<string, unknown>): User {
  const rawRole = String(raw['role'] ?? raw['tipo'] ?? 'subscrito')
  return {
    id: Number(raw['id']),
    name: String(raw['name'] ?? raw['nome'] ?? ''),
    email: String(raw['email'] ?? ''),
    province: (raw['province'] ?? raw['provincia'] ?? null) as string | null,
    institution: (raw['institution'] ?? raw['instituicao'] ?? null) as string | null,
    course: (raw['course'] ?? raw['curso'] ?? null) as string | null,
    role: rawRole as User['role'],
    isAdmin: rawRole === 'admin' || rawRole === 'superadmin',
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    ;(async () => {
      try {
        const token = await getToken()
        const saved = await getStoredUser<Record<string, unknown>>()
        if (token && saved) setUser(normalizeUser(saved))
      } finally {
        setLoading(false)
      }
    })()
  }, [])

  async function persist(rawUser: Record<string, unknown>, token: string) {
    const normalized = normalizeUser(rawUser)
    await setToken(token)
    await setStoredUser(normalized)
    setUser(normalized)
  }

  const login: AuthContextType['login'] = async (email, password) => {
    try {
      const res = await apiRequest<{ token: string; user: Record<string, unknown> }>(
        '/auth/login',
        { method: 'POST', json: { email, password }, anonymous: true },
      )
      await persist(res.user, res.token)
      return true
    } catch {
      return false
    }
  }

  const register: AuthContextType['register'] = async (name, email, password, province) => {
    try {
      const res = await apiRequest<{ token: string; user: Record<string, unknown> }>(
        '/auth/register',
        { method: 'POST', anonymous: true, json: { name, email, password, province } },
      )
      await persist(res.user, res.token)
      return true
    } catch {
      return false
    }
  }

  const logout: AuthContextType['logout'] = async () => {
    apiRequest('/auth/logout', { method: 'POST' }).catch(() => null)
    await removeToken()
    setUser(null)
  }

  const refreshUser: AuthContextType['refreshUser'] = async () => {
    try {
      const res = await apiRequest<{ user: Record<string, unknown> }>('/auth/me')
      const normalized = normalizeUser(res.user)
      await setStoredUser(normalized)
      setUser(normalized)
    } catch {
      /* token inválido — interceptor já limpou */
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth deve ser usado dentro de AuthProvider')
  return ctx
}
