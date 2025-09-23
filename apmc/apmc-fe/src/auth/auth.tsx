"use client"

import type React from "react"
import { createContext, useContext, useEffect, useMemo, useState } from "react"
import type { User } from "../types"

// Define a type for the data you'll collect at sign-up
type SignUpData = {
  email: string
  password: string
  address: string
  phoneNumber: string
  capacity: string
}

// Define the shape of your authentication context
type AuthCtx = {
  user: User | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (data: SignUpData) => Promise<void>
  signOut: () => void
}

const AuthContext = createContext<AuthCtx | null>(null)

// --- HELPER FUNCTION ---
// This function creates a mock user session and handles localStorage.
// It ensures the returned user object always matches the `User` type.
const createMockUserSession = (email: string): User => {
  const mockUser: User = {
    id: `user_${Date.now()}`,
    email,
    role: "apmc", // This explicitly matches the `User` type's role
  };
  const mockToken = `mock-jwt-for-${email}`;

  localStorage.setItem("authToken", mockToken);
  localStorage.setItem("userEmail", email);

  return mockUser;
};


export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem("authToken")
    if (token) {
      const storedEmail = localStorage.getItem("userEmail") || "user@example.com"
      // Simulate session verification by recreating the user object
      setUser(createMockUserSession(storedEmail))
    }
    setLoading(false)
  }, [])

  const value = useMemo<AuthCtx>(
    () => ({
      user,
      loading,
      signIn: async (email: string, password: string) => {
        console.log("Simulating sign-in for:", { email, password })
        await new Promise((resolve) => setTimeout(resolve, 500)) // Simulate network delay

        // Use the helper to create a valid user session
        const loggedInUser = createMockUserSession(email)
        setUser(loggedInUser)
      },

      signUp: async (data: SignUpData) => {
        console.log("Simulating sign-up for:", data.email)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Use the helper to create a valid user session upon sign-up
        const newUser = createMockUserSession(data.email)
        setUser(newUser)
      },

      signOut: () => {
        setUser(null)
        localStorage.removeItem("authToken")
        localStorage.removeItem("userEmail")
      },
    }),
    [user, loading],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}