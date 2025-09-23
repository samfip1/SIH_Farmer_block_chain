import React, { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function SignUp() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    location: "",
    totalArea: "",
    phone: "",
  });
  const [error, setError] = useState<string | null>(null);
  // In a real app, you would use a signUp function from your context
  // const { signUp } = useAuth(); 

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      // In the future, you would call your backend here:
      // await signUp(formData);
      alert("Sign-up successful! You can now sign in.");
      // You might want to navigate to the sign-in page automatically
    } catch (err: any) {
      setError(err.message || "Failed to sign up.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center text-gray-800">Create Your Company Account</h1>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {/* Input fields for sign-up data */}
          <InputField label="Email Address" name="email" type="email" value={formData.email} onChange={handleChange} required />
          <InputField label="Password" name="password" type="password" value={formData.password} onChange={handleChange} required />
          <InputField label="Location / Address" name="location" type="text" value={formData.location} onChange={handleChange} required />
          <InputField label="Total Area (sq. ft.)" name="totalArea" type="text" value={formData.totalArea} onChange={handleChange} required />
          <InputField label="Phone Number" name="phone" type="tel" value={formData.phone} onChange={handleChange} required />
          
          {error && <p className="text-red-500 text-sm">{error}</p>}

          <button type="submit" className="w-full px-4 py-2 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500">
            Sign Up
          </button>
        </form>
        <p className="text-sm text-center text-gray-600">
          Already have an account?{" "}
          <Link to="/signin" className="text-green-600 hover:underline">
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}

// Helper component for input fields to keep the form clean
const InputField = ({ label, name, type, value, onChange, required = false }: any) => (
  <div>
    <label htmlFor={name} className="block text-sm font-medium text-gray-700">{label}</label>
    <input
      id={name}
      name={name}
      type={type}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
    />
  </div>
);