const baseUrl = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:4000/api'

export async function getHealth() {
  const response = await fetch(`${baseUrl}/health`)
  return response.json()
}
