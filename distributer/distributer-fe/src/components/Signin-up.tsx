"use client";

import { useState } from "react";
import axios from "axios";
// Importing the same background image for consistency
import natureBg from "../assets/react.svg";

interface DistributorProps {
  onSignIn: (userData: any) => void;
}

// Common input field component moved outside the main function
const InputField = ({ label, id, name, type, placeholder, required, value, onChange }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label}
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300 placeholder-gray-400"
      placeholder={placeholder}
    />
  </div>
);

const Signin_up = ({ onSignIn }: DistributorProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    username: "",
    state: "",
    password: "",
    reEnterPassword: "",
    warehouseAddress: "",
    phoneNumber: "",
    warehouseCapacity: "",
    email: "",
    agreedToTerms: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SIGNUP_URL = "/api/distributor-signup";
  const SIGNIN_URL = "/api/distributor-signin";

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setIsLoading(true);

    if (isSignUp) {
      if (formData.password !== formData.reEnterPassword) {
        setMessage("Passwords do not match!");
        setIsError(true);
        setIsLoading(false);
        return;
      }
      if (!formData.agreedToTerms) {
        setMessage("You must agree to the Terms and Conditions.");
        setIsError(true);
        setIsLoading(false);
        return;
      }

      const url = SIGNUP_URL;
      const data = {
        username: formData.username,
        password: formData.password,
        state: formData.state,
        warehouseAddress: formData.warehouseAddress,
        phoneNumber: formData.phoneNumber,
        warehouseCapacity: formData.warehouseCapacity,
        email: formData.email,
      };

      try {
        const response = await axios.post(url, data);
        if (response.status === 200) {
          setMessage("Sign-up successful! You can now sign in.");
          setIsError(false);
          setIsSignUp(false);
        } else {
          setMessage(response.data.message || "An error occurred. Please try again.");
          setIsError(true);
        }
      } catch (error: any) {
        setMessage(error.response?.data?.message || "An error occurred. Please try again.");
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    } else {
      const userData = {
        username: formData.username,
        state: formData.state || "Maharashtra",
        warehouseAddress: formData.warehouseAddress || "Distributor Warehouse, Mumbai",
        phoneNumber: formData.phoneNumber || "+91 98765 43210",
        warehouseCapacity: formData.warehouseCapacity || "500 sq. m",
        email: formData.email || "distributor@example.com",
      };

      setTimeout(() => {
        setMessage("Sign-in successful!");
        setIsError(false);
        onSignIn(userData);
        setIsLoading(false);
      }, 1000);
    }
  };

  const togglePasswordVisibility = (field: string) => {
    if (field === "password") {
      setPasswordVisible(!passwordVisible);
    } else {
      setRePasswordVisible(!rePasswordVisible);
    }
  };

  const renderSignUpForm = () => (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Distributor Sign Up</h1>
        <p className="text-gray-500 text-base sm:text-lg">Register your business in minutes.</p>
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
          <InputField
            label="Warehouse Capacity (sq. m)"
            id="warehouseCapacity"
            name="warehouseCapacity"
            type="number"
            placeholder="e.g., 500"
            required
            value={formData.warehouseCapacity}
            onChange={handleChange}
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pt-4">
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300"
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
            <label htmlFor="reEnterPassword" className="block text-sm font-medium text-gray-700">
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
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300"
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
            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-600"
          />
          <label htmlFor="agreedToTerms" className="text-sm text-gray-600 leading-relaxed">
            I agree to the{" "}
            <a href="#" className="text-green-600 font-medium hover:underline">
              terms & policy
            </a>
          </label>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-lg shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
      <div className="text-center text-sm text-gray-500 pt-6">
        Already have an account?{" "}
        <span className="text-green-600 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>
          Sign In
        </span>
      </div>
    </>
  );

  const renderSignInForm = () => (
    <>
      <div className="space-y-2 mb-8">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Distributor Sign In</h1>
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
          <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
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
              className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-green-600 transition-all duration-300"
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
      <div className="text-center text-sm text-gray-500 pt-6">
        Don't have an account?{" "}
        <span className="text-green-600 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(true)}>
          Sign Up
        </span>
      </div>
    </>
  );

  return (
    <div className="bg-gradient-to-br from-green-50 to-green-100 min-h-screen flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
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
        <div className="w-full lg:w-1/2 hidden lg:block relative">
          <img
            src={natureBg}
            alt="Green Nature Background"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-green-900 bg-opacity-20"></div>
        </div>
      </div>
    </div>
  );
};

export default Signin_up;