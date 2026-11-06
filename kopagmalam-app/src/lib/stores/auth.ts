import { create } from "zustand"
import type { AuthUser, RoleName } from "@/lib/api/types"
import {
  clearSession,
  readSession,
  saveSession,
} from "@/lib/native/secure-storage"

type AuthStatus = "loading" | "authenticated" | "guest"

interface AuthState {
  user: AuthUser | null
  token: string | null
  status: AuthStatus
  setSession: (token: string, user: AuthUser) => Promise<void>
  hydrate: () => Promise<void>
  logout: () => Promise<void>
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: null,
  status: "loading",

  setSession: async (token, user) => {
    await saveSession(token, user)
    set({ token, user, status: "authenticated" })
  },

  hydrate: async () => {
    const { token, user } = await readSession()

    if (token && user) {
      set({ token, user, status: "authenticated" })
      return
    }

    set({ token: null, user: null, status: "guest" })
  },

  logout: async () => {
    await clearSession()
    set({ token: null, user: null, status: "guest" })
  },
}))

export function hasRole(user: AuthUser | null, roles: RoleName[]): boolean {
  if (!user) {
    return false
  }

  return user.roles.some((role) => roles.includes(role.name))
}

export function isStaff(user: AuthUser | null): boolean {
  return hasRole(user, ["cashier", "admin", "manager"])
}

export function canManage(user: AuthUser | null): boolean {
  return hasRole(user, ["admin", "manager"])
}
