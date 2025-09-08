"use client"

import { useState } from "react"
import Signin_up from "./components/signin-up"
import Dashboard from "./components/dashboard"

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)

  const handleSignIn = (userData: any) => {
    setUser(userData)
    setIsAuthenticated(true)
  }

  const handleSignOut = () => {
    setUser(null)
    setIsAuthenticated(false)
  }

  if (isAuthenticated) {
    return <Dashboard user={user} onSignOut={handleSignOut} />
  }

  return <Signin_up onSignIn={handleSignIn} />
}
