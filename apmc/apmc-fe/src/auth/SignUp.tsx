"use client"

import type React from "react"
import { useState } from "react"
import { useAuth } from "./auth" // Assuming this hook handles your auth logic
import { useNavigate, Link } from "react-router-dom"

export default function SignUp() {
  // The signUp function from your auth context will need to be updated
  // to accept these new fields.
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    address: "",
    phoneNumber: "",
    capacity: "", // e.g., in square feet or metric tons
  })
  const [error, setError] = useState<string | null>(null)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  async function handleSubmit(e: React.FormEvent) {
  e.preventDefault()
  setError(null)
  try {
    // BEFORE (Your current code causing the error):
    // await signUp(
    //   formData.email,
    //   formData.password,
    //   formData.address,
    //   formData.phoneNumber,
    //   formData.capacity,
    // )

    // AFTER (The correct way):
    await signUp(formData) // Pass the entire object as one argument

    navigate("/dashboard", { replace: true })
  } catch (err: any) {
    setError(err.message || "Failed to sign up")
  }
}

  return (
    <section className="max-w-xl mx-auto mt-8 bg-card text-card-foreground border border-border rounded-lg p-6 sm:p-8">
      <h1 className="text-2xl font-semibold mb-4 text-pretty">Create Your Account</h1>
      <form className="grid gap-4" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Email Input */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Email</span>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              placeholder="you@example.com"
            />
          </label>

          {/* Phone Number Input */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Phone Number</span>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="tel"
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleInputChange}
              required
              placeholder="+91 12345 67890"
            />
          </label>
        </div>

        {/* Address Input */}
        <label className="grid gap-1">
          <span className="text-sm font-medium">Full Address</span>
          <input
            className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
            type="text"
            name="address"
            value={formData.address}
            onChange={handleInputChange}
            required
            placeholder="Your warehouse or primary business address"
          />
        </label>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Password Input */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Password</span>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              placeholder="••••••••"
            />
          </label>

          {/* Capacity Input */}
          <label className="grid gap-1">
            <span className="text-sm font-medium">Warehouse Capacity</span>
            <input
              className="w-full rounded-md border border-input bg-background px-3 py-2 outline-none focus:ring-2 focus:ring-ring"
              type="text" // Use text to allow units like "500 sq ft" or "100 tons"
              name="capacity"
              value={formData.capacity}
              onChange={handleInputChange}
              required
              placeholder="e.g., 500 sq ft"
            />
          </label>
        </div>

        {error && (
          <div className="rounded-md border border-amber-300 bg-amber-50 px-3 py-2 text-amber-800">{error}</div>
        )}

        <button
          className="rounded-md bg-primary text-primary-foreground px-4 py-2 font-semibold hover:opacity-90 mt-2"
          type="submit"
        >
          Create Account
        </button>
      </form>
      <p className="mt-4 text-center text-sm">
        {"Already have an account? "}
        <Link className="text-primary underline underline-offset-4" to="/signin">
          Sign In
        </Link>
      </p>
    </section>
  )
}