"use client"

import type React from "react"
import { Routes, Route, Navigate, Link, useLocation } from "react-router-dom"
import Dashboard from "./components/Dashboard"
import RequestDetails from "./components/RequestDetails"
import DistributorRequests from "./components/DistributorRequests"
import Inventory from "./components/Inventry"
import SignIn from "./auth/SignIn"
import SignUp from "./auth/SignUp"
import { useAuth } from "./auth/auth"

function PrivateRoute({ children }: { children: React.ReactNode }) {
  const { user } = useAuth()
  const location = useLocation()
  if (!user) {
    return <Navigate to="/signin" state={{ from: location }} replace />
  }
  return <>{children}</>
}

function Nav() {
  const { user, signOut } = useAuth()
  return (
    <header className="bg-primary text-primary-foreground sticky top-0 z-10" role="banner" aria-label="Top navigation">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 font-semibold">
          <span className="text-xl" aria-hidden="true">
            🌾
          </span>
          <span className="text-pretty">APMC Dashboard</span>
        </div>
        <nav aria-label="Primary">
          <ul className="flex items-center gap-3 m-0 p-0">
            {user ? (
              <>
                <li>
                  <Link className="underline-offset-4 hover:underline" to="/dashboard">
                    Requests
                  </Link>
                </li>
                <li>
                  <Link className="underline-offset-4 hover:underline" to="/distributor">
                    Distributor
                  </Link>
                </li>
                <li>
                  <Link className="underline-offset-4 hover:underline" to="/inventory">
                    Inventory
                  </Link>
                </li>
                <li className="opacity-90">Signed in as {user.email}</li>
                <li>
                  <button
                    className="border border-primary-foreground/40 rounded-md px-3 py-1.5 bg-transparent text-primary-foreground hover:bg-primary-foreground/10"
                    onClick={signOut}
                  >
                    Sign out
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link className="underline-offset-4 hover:underline" to="/signin">
                    Sign In
                  </Link>
                </li>
                <li>
                  <Link className="underline-offset-4 hover:underline" to="/signup">
                    Sign Up
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  )
}

export default function App() {
  return (
    <div className="min-h-dvh bg-background text-foreground">
      <Nav />
      <main className="max-w-5xl mx-auto px-4 py-6" role="main">
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" replace />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/requests/:id"
            element={
              <PrivateRoute>
                <RequestDetails />
              </PrivateRoute>
            }
          />
          <Route
            path="/distributor"
            element={
              <PrivateRoute>
                <DistributorRequests />
              </PrivateRoute>
            }
          />
          <Route
            path="/inventory"
            element={
              <PrivateRoute>
                <Inventory />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<div>Not Found</div>} />
        </Routes>
      </main>
      <footer className="border-t border-border mt-12">
        <div className="max-w-5xl mx-auto px-4 py-4 text-sm">© {new Date().getFullYear()} APMC</div>
      </footer>
    </div>
  )
}
