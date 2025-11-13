"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import type { User } from "firebase/auth"

interface AuthContextType {
  user: User | null
  loading: boolean
  error: string | null
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  error: null,
})

export const useAuth = () => useContext(AuthContext)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Only run on client side
    if (typeof window === "undefined") {
      setLoading(false)
      return
    }

    // Check for test user first
    const testUser = localStorage.getItem("testUser")
    if (testUser) {
      try {
        const parsedUser = JSON.parse(testUser)
        console.log("Test user found:", parsedUser)
        setUser(parsedUser as User)
        setLoading(false)
        return
      } catch (e) {
        console.error("Error parsing test user:", e)
        localStorage.removeItem("testUser")
      }
    }

    // Initialize Firebase and set up auth listener
    const setupAuth = async () => {
      try {
        const { getFirebaseServices } = await import("@/lib/firebase")
        const { auth } = await getFirebaseServices()

        if (!auth) {
          console.warn("Firebase auth not available")
          setError("Authentication service not available - using test mode")
          setLoading(false)
          return
        }

        const { onAuthStateChanged } = await import("firebase/auth")

        const unsubscribe = onAuthStateChanged(
          auth,
          (user) => {
            console.log("Auth state changed:", user ? user.uid : "no user")
            setUser(user)
            setLoading(false)
            setError(null)
          },
          (error) => {
            console.error("Auth state change error:", error)
            setError("Authentication error occurred")
            setLoading(false)
          },
        )

        return unsubscribe
      } catch (error) {
        console.error("Failed to setup Firebase auth:", error)
        setError("Failed to load authentication service")
        setLoading(false)
      }
    }

    setupAuth()
  }, [])

  return <AuthContext.Provider value={{ user, loading, error }}>{children}</AuthContext.Provider>
}
