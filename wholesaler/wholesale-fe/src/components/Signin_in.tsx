"use client"

import { useState } from "react"
import axios from "axios"

const wholesalerBg = "./green-fern-nature-background-for-agricultural-port.jpg"

interface WholesalerProps {
  onSignIn: (userData: any) => void
}

const InputField = ({ label, id, name, type, placeholder, required, value, onChange }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-semibold text-gray-800">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition-all duration-300 placeholder-gray-400"
      placeholder={placeholder}
    />
  </div>
)

const WholesalerAuth = ({ onSignIn }: WholesalerProps) => {
  console.log("[v0] WholesalerAuth component rendering")
  console.log("[v0] Background image path:", wholesalerBg)

  const [isSignUp, setIsSignUp] = useState(false) // Changed default to false to show sign-in form first
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    reEnterPassword: "",
    warehouseAddress: "",
    phoneNumber: "",
    email: "",
    state: "",
    agreedToTerms: false,
  })

  const [passwordVisible, setPasswordVisible] = useState(false)
  const [rePasswordVisible, setRePasswordVisible] = useState(false)
  const [message, setMessage] = useState("")
  const [isError, setIsError] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const SIGNUP_URL = "/api/wholesaler-signup"
  //   const SIGNIN_URL = "/api/wholesaler-signin";

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }))
  }

  const handleSubmit = async (e: any) => {
    e.preventDefault()
    setMessage("")
    setIsError(false)
    setIsLoading(true)

    if (isSignUp) {
      if (formData.password !== formData.reEnterPassword) {
        setMessage("Passwords do not match!")
        setIsError(true)
        setIsLoading(false)
        return
      }
      if (!formData.agreedToTerms) {
        setMessage("You must agree to the Terms and Conditions.")
        setIsError(true)
        setIsLoading(false)
        return
      }

      const url = SIGNUP_URL
      const data = {
        username: formData.username,
        password: formData.password,
        state: formData.state,
        warehouseAddress: formData.warehouseAddress,
        phoneNumber: formData.phoneNumber,
        email: formData.email,
      }

      try {
        const response = await axios.post(url, data)
        if (response.status === 200) {
          setMessage("Sign-up successful! You can now sign in.")
          setIsError(false)
          setIsSignUp(false)
        } else {
          setMessage(response.data.message || "An error occurred. Please try again.")
          setIsError(true)
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "An error occurred. Please try again.")
        setIsError(true)
      } finally {
        setIsLoading(false)
      }
    } else {
      const userData = {
        username: formData.username,
        state: formData.state || "Andhra Pradesh",
        warehouseAddress: formData.warehouseAddress || "Wholesaler Office, Hyderabad",
        phoneNumber: formData.phoneNumber || "+91 98765 43210",
        email: formData.email || "wholesaler@example.com",
      }

      setTimeout(() => {
        setMessage("Sign-in successful!")
        setIsError(false)
        if (typeof onSignIn === "function") {
          onSignIn(userData)
        }
        setIsLoading(false)
      }, 1000)
    }
  }

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible)
    } else {
      setRePasswordVisible(!rePasswordVisible)
    }
  }

  const renderSignUpForm = () => (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Wholesaler Sign Up</h1>
        <p className="text-gray-500 text-base sm:text-lg">Join our network and grow your business.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Username"
            id="username"
            name="username"
            type="text"
            placeholder="Choose a unique username"
            required
            value={formData.username}
            onChange={handleChange}
          />
          <InputField
            label="Email"
            id="email"
            name="email"
            type="email"
            placeholder="Enter your email"
            required
            value={formData.email}
            onChange={handleChange}
          />
          <InputField
            label="State"
            id="state"
            name="state"
            type="text"
            placeholder="Enter your state"
            required
            value={formData.state}
            onChange={handleChange}
          />
          <InputField
            label="Phone Number"
            id="phoneNumber"
            name="phoneNumber"
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            required
            value={formData.phoneNumber}
            onChange={handleChange}
          />
          <div className="space-y-2 sm:col-span-2">
            <InputField
              label="Warehouse/Office Address"
              id="warehouseAddress"
              name="warehouseAddress"
              type="text"
              placeholder="Enter your address"
              required
              value={formData.warehouseAddress}
              onChange={handleChange}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-semibold text-gray-800">
              Password
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition-all duration-300"
                placeholder="Create a password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => togglePasswordVisibility("password")}
              >
                {passwordVisible ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
          <div className="space-y-2">
            <label htmlFor="reEnterPassword" className="block text-sm font-semibold text-gray-800">
              Re-enter Password
            </label>
            <div className="relative">
              <input
                type={rePasswordVisible ? "text" : "password"}
                id="reEnterPassword"
                name="reEnterPassword"
                value={formData.reEnterPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition-all duration-300"
                placeholder="Re-enter your password"
              />
              <button
                type="button"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={() => togglePasswordVisibility("rePassword")}
              >
                {rePasswordVisible ? "🙈" : "👁️"}
              </button>
            </div>
          </div>
        </div>

        <div className="flex items-start space-x-3 pt-4">
          <input
            type="checkbox"
            id="agreedToTerms"
            name="agreedToTerms"
            checked={formData.agreedToTerms}
            onChange={handleChange}
            required
            className="mt-1 h-4 w-4 text-green-700 border-gray-300 rounded focus:ring-green-700"
          />
          <label htmlFor="agreedToTerms" className="text-sm text-gray-600 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-green-700 font-medium hover:underline">
              terms & policy
            </a>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 font-medium">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button
        type="button"
        className="w-full py-3 px-4 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12.0001 4.75C14.735 4.75 17.027 5.766 18.6657 7.42437L20.5962 5.51351C18.2393 3.12527 15.1102 1.75 12.0001 1.75C8.80709 1.75 5.75336 2.9497 3.49392 5.27643L5.62934 7.43389C7.4727 5.61868 9.68961 4.75 12.0001 4.75Z"
            fill="#EA4335"
          />
          <path
            d="M22.0805 12.0001C22.0805 11.3284 22.0294 10.6695 21.921 10.0195H12.0001V13.9995H17.5147C17.3073 15.0258 16.6573 16.3262 15.5393 17.1594L17.7001 18.995C19.8653 17.0694 21.1396 14.5082 21.7337 12.0001H22.0805Z"
            fill="#4285F4"
          />
          <path
            d="M3.49392 5.27643L1.3585 3.11897C0.844116 4.19503 0.174776 5.65874 0.059495 7.15654H3.88291C4.0152 6.55134 4.31464 5.97549 4.76785 5.52622C5.22105 5.07695 5.76074 4.76735 6.36015 4.59567C6.95955 4.42399 7.59258 4.39461 8.22557 4.50853C8.85856 4.62245 9.47192 4.88145 10.021 5.26941L7.88556 7.43387C7.57943 7.2343 7.2519 7.08638 6.90998 6.99616C6.56807 6.90595 6.21639 6.87413 5.86976 6.89972C5.52313 6.92531 5.18349 7.00845 4.86765 7.14515C4.55182 7.28185 4.26252 7.47053 4.01831 7.69992L3.49392 5.27643Z"
            fill="#FBBC04"
          />
          <path
            d="M12.0001 22.25C14.7176 22.25 17.1824 21.288 19.068 19.6644L17.7002 18.9952C16.3686 20.2195 14.3168 21.0001 12.0001 21.0001C8.82885 21.0001 6.13458 19.0207 4.96062 16.2736L2.83984 18.4215C3.89622 20.9329 5.82025 22.25 8.80709 22.25C9.84975 22.25 10.925 22.0913 12.0001 21.8485V22.25Z"
            fill="#34A853"
          />
        </svg>
        <span>Sign Up with Google</span>
      </button>
      <div className="text-center text-sm text-gray-500 pt-6">
        Already have an account?{" "}
        <span className="text-green-700 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>
          Sign In
        </span>
      </div>
    </>
  )

  const renderSignInForm = () => (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Wholesaler Sign In</h1>
        <p className="text-gray-500 text-base sm:text-lg">Welcome back!</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <InputField
          label="Username"
          id="signin-username"
          name="username"
          type="text"
          placeholder="Enter your username"
          required
          value={formData.username}
          onChange={handleChange}
        />
        <div className="space-y-2">
          <label htmlFor="signin-password" className="block text-sm font-semibold text-gray-800">
            Password
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="signin-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none focus:ring-2 focus:ring-green-700 focus:border-green-700 transition-all duration-300"
              placeholder="Enter your password"
            />
            <button
              type="button"
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
              onClick={() => togglePasswordVisibility("password")}
            >
              {passwordVisible ? "🙈" : "👁️"}
            </button>
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-500 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? "Signing in..." : "Sign In"}
        </button>
      </form>
      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 font-medium">or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>
      <button
        type="button"
        className="w-full py-3 px-4 flex items-center justify-center space-x-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition duration-300"
      >
        <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
          <path
            d="M12.0001 4.75C14.735 4.75 17.027 5.766 18.6657 7.42437L20.5962 5.51351C18.2393 3.12527 15.1102 1.75 12.0001 1.75C8.80709 1.75 5.75336 2.9497 3.49392 5.27643L5.62934 7.43389C7.4727 5.61868 9.68961 4.75 12.0001 4.75Z"
            fill="#EA4335"
          />
          <path
            d="M22.0805 12.0001C22.0805 11.3284 22.0294 10.6695 21.921 10.0195H12.0001V13.9995H17.5147C17.3073 15.0258 16.6573 16.3262 15.5393 17.1594L17.7001 18.995C19.8653 17.0694 21.1396 14.5082 21.7337 12.0001H22.0805Z"
            fill="#4285F4"
          />
          <path
            d="M3.49392 5.27643L1.3585 3.11897C0.844116 4.19503 0.174776 5.65874 0.059495 7.15654H3.88291C4.0152 6.55134 4.31464 5.97549 4.76785 5.52622C5.22105 5.07695 5.76074 4.76735 6.36015 4.59567C6.95955 4.42399 7.59258 4.39461 8.22557 4.50853C8.85856 4.62245 9.47192 4.88145 10.021 5.26941L7.88556 7.43387C7.57943 7.2343 7.2519 7.08638 6.90998 6.99616C6.56807 6.90595 6.21639 6.87413 5.86976 6.89972C5.52313 6.92531 5.18349 7.00845 4.86765 7.14515C4.55182 7.28185 4.26252 7.47053 4.01831 7.69992L3.49392 5.27643Z"
            fill="#FBBC04"
          />
          <path
            d="M12.0001 22.25C14.7176 22.25 17.1824 21.288 19.068 19.6644L17.7002 18.9952C16.3686 20.2195 14.3168 21.0001 12.0001 21.0001C8.82885 21.0001 6.13458 19.0207 4.96062 16.2736L2.83984 18.4215C3.89622 20.9329 5.82025 22.25 8.80709 22.25C9.84975 22.25 10.925 22.0913 12.0001 21.8485V22.25Z"
            fill="#34A853"
          />
        </svg>
        <span>Sign In with Google</span>
      </button>
      <div className="text-center text-sm text-gray-500 pt-6">
        Don't have an account?{" "}
        <span className="text-green-700 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(true)}>
          Sign Up
        </span>
      </div>
    </>
  )

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-green-50">
      <div className="flex flex-col lg:flex-row w-full max-w-6xl bg-white rounded-3xl shadow-2xl overflow-hidden">
        <div className="w-full lg:w-1/2 p-6 sm:p-10">
          {isSignUp ? renderSignUpForm() : renderSignInForm()}
          {isLoading && (
            <div className="mt-4 text-center py-3 px-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
              Loading...
            </div>
          )}
          {message && !isLoading && (
            <div
              className={`mt-4 text-center py-3 px-4 rounded-xl border ${
                isError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
              }`}
            >
              {message}
            </div>
          )}
        </div>
        <div
          className="w-full lg:w-1/2 hidden lg:flex flex-col justify-between p-10 relative text-white bg-cover bg-center"
          style={{
            backgroundImage: `url(${wholesalerBg})`,
            backgroundColor: "#166534",
          }}
        >
          <div className="absolute inset-0 bg-green-900 bg-opacity-80"></div>
          <div className="relative z-10 flex flex-col justify-between h-full">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-white rounded-full"></div>
              <span className="font-bold text-lg">Wholesaler Portal</span>
            </div>
            <div className="space-y-4 my-auto">
              <h2 className="text-4xl font-bold leading-tight">
                Bridge the Gap, <br />
                Grow Together.
              </h2>
              <p className="text-green-200 text-lg">
                Connect with distributors and farmers to build a seamless agricultural supply chain.
              </p>
            </div>
            <div className="flex justify-between items-center text-sm font-light text-green-300">
              <span>© 2025 Wholesaler Portal</span>
              <div className="space-x-4">
                <a href="#" className="hover:underline">
                  Privacy Policy
                </a>
                <a href="#" className="hover:underline">
                  Terms of Service
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WholesalerAuth
