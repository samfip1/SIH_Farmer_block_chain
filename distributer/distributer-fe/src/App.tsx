import { useState, useEffect } from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import Signin_up from "./components/Signin-up"
import "./App.css"

function App() {
  const [user, setUser] = useState<{ username: string } | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // On initial load, check if user data is stored in localStorage
  useEffect(() => {
    const token = localStorage.getItem("authToken")
    const username = localStorage.getItem("username")
    if (token && username) {
      setUser({ username })
      setIsAuthenticated(true)
    }
  }, [])

  // Function to handle successful sign-in
  const handleSignIn = (userData: any) => {
    if (userData && userData.token && userData.user) {
      const username = userData.user.username || "User"
      
      // Store info to stay logged in after a refresh
      localStorage.setItem("authToken", userData.token)
      localStorage.setItem("username", username)

      // Update state to trigger re-render
      setUser({ username })
      setIsAuthenticated(true)
    }
  }

  // Function to handle sign-out
  const handleSignOut = () => {
    localStorage.removeItem("authToken")
    localStorage.removeItem("username")
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/login"
          element={!isAuthenticated ? <Signin_up onSignIn={handleSignIn} /> : <Navigate to="/" />}
        />
        <Route
          path="/*"
          element={isAuthenticated ? <Dashboard onSignOut={handleSignOut} user={user} /> : <Navigate to="/login" />}
        />
      </Routes>
    </BrowserRouter>
  )
}

export default App