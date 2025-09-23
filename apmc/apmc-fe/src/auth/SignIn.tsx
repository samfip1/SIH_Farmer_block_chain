"use client"

import { useState } from "react"
import { useAuth } from "./auth"
import { useLocation, useNavigate, Link } from "react-router-dom"

export default function SignIn() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const navigate = useNavigate()
  const location = useLocation() as any

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    try {
      // Login anyone
      await signIn(email, password)
      const to = location.state?.from?.pathname || "/dashboard"
      navigate(to, { replace: true })
    } catch (err: any) {
      setError(err.message || "Failed to sign in")
    }
  }

  return (
    <section className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-purple-200">
      <div className="w-full max-w-md p-8 bg-white rounded-2xl shadow-xl border border-gray-200">
        <h1 className="text-3xl font-bold text-center mb-6 text-purple-700">Sign In</h1>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="your@email.com"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-400 focus:outline-none"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm bg-red-100 px-3 py-2 rounded-md">{error}</div>
          )}
          <button
            type="submit"
            className="w-full py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition"
          >
            Sign In
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          Don't have an account?{" "}
          <Link className="text-purple-600 font-medium hover:underline" to="/signup">
            Sign Up
          </Link>
        </p>
      </div>
    </section>
  )
}
