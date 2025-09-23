import React, { createContext, useState, useContext, useMemo, useEffect } from "react";

// Define the shape of the user object
interface User {
  id: string;
  email: string;
  role: string; // e.g., 'company_admin'
}

// Define what the context will provide
interface AuthContextType {
  user: User | null;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => void;
  loading: boolean;
}

// Create the context
const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Check for a logged-in user in localStorage on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const authValue = useMemo(
    () => ({
      user,
      loading,
      signIn: async (email: string, password: string) => {
        console.log("Attempting to sign in with:", email, password);
        // --- SIMPLIFIED SIGN-IN ---
        // For now, we accept any credentials and create a mock user.
        // In the future, you'll replace this with an API call to your backend.
        const mockUser: User = {
          id: `user_${Date.now()}`,
          email: email,
          role: "company_admin",
        };
        localStorage.setItem("user", JSON.stringify(mockUser));
        setUser(mockUser);
      },
      signOut: () => {
        setUser(null);
        localStorage.removeItem("user");
      },
    }),
    [user, loading]
  );

  return (
    <AuthContext.Provider value={authValue}>
      {!loading && children}
    </AuthContext.Provider>
  );
}

// Custom hook for easy access to the auth context
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}