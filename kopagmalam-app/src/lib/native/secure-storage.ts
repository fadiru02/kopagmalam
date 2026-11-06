import { SecureStorage } from "@aparajita/capacitor-secure-storage"
import type { AuthUser } from "@/lib/api/types"

const TOKEN_KEY = "kopagmalam.auth.token"
const USER_KEY = "kopagmalam.auth.user"

export interface StoredSession {
  token: string | null
  user: AuthUser | null
}

export async function saveSession(
  token: string,
  user: AuthUser,
): Promise<void> {
  await SecureStorage.set(TOKEN_KEY, token)
  await SecureStorage.set(USER_KEY, JSON.stringify(user))
}

export async function readSession(): Promise<StoredSession> {
  try {
    const [token, rawUser] = await Promise.all([
      SecureStorage.get(TOKEN_KEY),
      SecureStorage.get(USER_KEY),
    ])

    return {
      token: typeof token === "string" ? token : null,
      user:
        typeof rawUser === "string"
          ? (JSON.parse(rawUser) as AuthUser)
          : null,
    }
  } catch {
    return { token: null, user: null }
  }
}

export async function clearSession(): Promise<void> {
  await Promise.all([
    SecureStorage.remove(TOKEN_KEY),
    SecureStorage.remove(USER_KEY),
  ])
}
