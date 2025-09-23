import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "./context/AuthContext";
import Dashboard from "./components/Dashboard";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import type React from "react";

// A component to protect routes that require authentication
function ProtectedRoute({ children }: { children: any }) {
  const { user } = useAuth();
  if (!user) {
    // If user is not logged in, redirect to the sign-in page
    return <Navigate to="/signin" />;
  }
  return children;
}

function App() {
  const { user } = useAuth();

  return (
    <Routes>
      <Route
        path="/signin"
        element={user ? <Navigate to="/" /> : <SignIn />}
      />
      <Route
        path="/signup"
        element={user ? <Navigate to="/" /> : <SignUp />}
      />
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        }
      />
      {/* You can add more protected routes here */}
    </Routes>
  );
}

export default App;