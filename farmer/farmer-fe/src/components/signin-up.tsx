"use client";

import { useState } from "react";
import axios from "axios";
import natureBg from "../../../../assets/farmer-avatar.png";

interface SigninUpProps {
  onSignIn: (userData: any) => void;
}

const InputField = ({ label, id, name, type, placeholder, required, value, onChange }: any) => (
  <div className="space-y-2">
    <label htmlFor={id} className="block text-sm font-medium text-gray-700">
      {label} *
    </label>
    <input
      type={type}
      id={id}
      name={name}
      value={value}
      onChange={onChange}
      required={required}
      className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
      placeholder={placeholder}
    />
  </div>
);

const Signin_up = ({ onSignIn }: SigninUpProps) => {
  const [isSignUp, setIsSignUp] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    password: "",
    reEnterPassword: "",
    phone: "",
    areaVillage: "",
    pincode: "",
    state: "",
    agreedToTerms: false,
  });

  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rePasswordVisible, setRePasswordVisible] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const SIGNUP_URL = "/api/signup";
  // const SIGNIN_URL = "/api/signin";

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
        name: formData.name,
        username: formData.username,
        password: formData.password,
        phone: formData.phone,
        areaVillage: formData.areaVillage,
        pincode: formData.pincode,
        state: formData.state,
      };

      try {
        const response = await axios.post(url, data);

        if (response.status === 200) {
          setMessage("Sign-up successful! You can now sign in.");
          setIsError(false);
          setIsSignUp(false); // Automatically switch to sign-in form after successful sign-up
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
      // --- START OF FAKE LOGIN LOGIC ---
      // This section simulates a successful sign-in without a backend call.
      const userData = {
        name: "John Farmer",
        username: formData.username,
        phone: "+91 98765 43210",
        areaVillage: "Green Valley Village",
        pincode: "123456",
        state: "Maharashtra",
      };

      // Set a fake loading state to make it look realistic
      setTimeout(() => {
        setMessage("Sign-in successful!");
        setIsError(false);
        onSignIn(userData);
        setIsLoading(false);
      }, 1000); // Simulate a network delay of 1 second
      // --- END OF FAKE LOGIN LOGIC ---
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Get Started Now</h1>
        <p className="text-gray-500 text-base sm:text-lg">Quick & easy farmer registration.</p>
      </div>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <InputField
            label="Name (as per AADHAAR)"
            id="name"
            name="name"
            type="text"
            placeholder="Enter your full name"
            required
            value={formData.name}
            onChange={handleChange}
          />
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
          <div className="space-y-2">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password *
            </label>
            <div className="relative">
              <input
                type={passwordVisible ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
              Re-enter Password *
            </label>
            <div className="relative">
              <input
                type={rePasswordVisible ? "text" : "password"}
                id="reEnterPassword"
                name="reEnterPassword"
                value={formData.reEnterPassword}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
          <div className="sm:col-span-2">
            <InputField
              label="Phone Number"
              id="phone"
              name="phone"
              type="tel"
              placeholder="+91 XXXXX XXXXX"
              required
              value={formData.phone}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="space-y-4 pt-4">
          <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="sm:col-span-2">
              <InputField
                label="Area/Village"
                id="areaVillage"
                name="areaVillage"
                type="text"
                placeholder="Enter your Area/Village"
                required
                value={formData.areaVillage}
                onChange={handleChange}
              />
            </div>
            <InputField
              label="Pincode"
              id="pincode"
              name="pincode"
              type="text"
              placeholder="123456"
              required
              value={formData.pincode}
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
            className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
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
          className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
        >
          {isLoading ? "Signing up..." : "Signup"}
        </button>
      </form>

      <div className="flex items-center my-4">
        <div className="flex-grow border-t border-gray-300"></div>
        <span className="flex-shrink mx-4 text-gray-500 font-medium">Or</span>
        <div className="flex-grow border-t border-gray-300"></div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4">
        <button
          type="button"
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition duration-300"
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
          <span>Sign up with Google</span>
        </button>
        <button
          type="button"
          className="w-full py-3 px-4 flex items-center justify-center space-x-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition duration-300"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
            <path
              d="M22.0001 12C22.0001 17.5228 17.523 22 12.0001 22C6.47726 22 2.00012 17.5228 2.00012 12C2.00012 6.47715 6.47726 2 12.0001 2C17.523 2 22.0001 6.47715 22.0001 12Z"
              fill="#0A66C2"
            />
            <path
              d="M16.602 9.09849V17.0001H13.8824V11.8349C13.8824 11.0261 13.5658 10.5186 12.8715 10.5186C12.1287 10.5186 11.6963 11.107 11.6963 12.0726V17.0001H16.602Z"
              fill="white"
            />
            <path
              d="M6.35783 7.82862C7.14321 7.82862 7.77708 7.19475 7.77708 6.40938C7.77708 5.62401 7.14321 4.99014 6.35783 4.99014C5.57245 4.99014 4.93858 5.62401 4.93858 6.40938C4.93858 7.19475 5.57245 7.82862 6.35783 7.82862Z"
              fill="white"
            />
            <path d="M4.97571 9.09849H7.72265V17.0001H4.97571V9.09849Z" fill="white" />
          </svg>
          <span>Sign up with LinkedIn</span>
        </button>
      </div>
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
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sign in to your account</h1>
        <p className="text-gray-500 text-base sm:text-lg">Welcome back, farmer!</p>
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
            Password *
          </label>
          <div className="relative">
            <input
              type={passwordVisible ? "text" : "password"}
              id="signin-password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
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
          className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
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
    <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex items-center justify-center p-4 sm:p-6">
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


// "use client"

// import { useState } from "react"
// import axios from "axios"

// interface SigninUpProps {
//   onSignIn: (userData: any) => void
// }

// const Signin_up = ({ onSignIn }: SigninUpProps) => {
//   const [isSignUp, setIsSignUp] = useState(true)

//   const [formData, setFormData] = useState({
//     name: "",
//     username: "",
//     password: "",
//     reEnterPassword: "",
//     phone: "",
//     areaVillage: "",
//     pincode: "",
//     state: "",
//     agreedToTerms: false,
//   })

//   // State for password visibility
//   const [passwordVisible, setPasswordVisible] = useState(false)
//   const [rePasswordVisible, setRePasswordVisible] = useState(false)

//   // State for showing success/error messages and loading status
//   const [message, setMessage] = useState("")
//   const [isError, setIsError] = useState(false)
//   const [isLoading, setIsLoading] = useState(false)

//   // Backend endpoints (replace with your actual URLs)
//   const SIGNUP_URL = "/api/signup"
//   const SIGNIN_URL = "/api/signin"

//   // Handle input changes
//   const handleChange = (e: any) => {
//     const { name, value, type, checked } = e.target
//     setFormData((prevData) => ({
//       ...prevData,
//       [name]: type === "checkbox" ? checked : value,
//     }))
//   }

//   // Handle form submission
//   const handleSubmit = async (e: any) => {
//     e.preventDefault()
//     setMessage("")
//     setIsError(false)
//     setIsLoading(true)

//     // Prepare data based on form type
//     let url
//     let data

//     if (isSignUp) {
//       // Sign-up specific validation
//       if (formData.password !== formData.reEnterPassword) {
//         setMessage("Passwords do not match!")
//         setIsError(true)
//         setIsLoading(false)
//         return
//       }
//       if (!formData.agreedToTerms) {
//         setMessage("You must agree to the Terms and Conditions.")
//         setIsError(true)
//         setIsLoading(false)
//         return
//       }
//       url = SIGNUP_URL
//       data = {
//         name: formData.name,
//         username: formData.username,
//         password: formData.password,
//         phone: formData.phone,
//         areaVillage: formData.areaVillage,
//         pincode: formData.pincode,
//         state: formData.state,
//       }
//     } else {
//       url = SIGNIN_URL
//       data = {
//         username: formData.username,
//         password: formData.password,
//       }
//     }

//     try {
//       const response = await axios.post(url, data, {
//         headers: {
//           "Content-Type": "application/json",
//         },
//       })

//       const responseData = response.data
//       setMessage(isSignUp ? "Sign-up successful! You can now sign in." : "Sign-in successful!")
//       setIsError(false)

//       if (!isSignUp) {
//         const userData = {
//           name: formData.name || responseData.user?.name || "Farmer",
//           username: formData.username,
//           phone: formData.phone || responseData.user?.phone,
//           areaVillage: formData.areaVillage || responseData.user?.areaVillage,
//           pincode: formData.pincode || responseData.user?.pincode,
//           state: formData.state || responseData.user?.state,
//           ...responseData.user,
//         }
//         onSignIn(userData)
//       } else {
//         setIsSignUp(false)
//       }
//     } catch (error: any) {
//       if (error.response) {
//         const errorData = error.response.data
//         setMessage(errorData.message || "An error occurred. Please try again.")
//         setIsError(true)
//       } else {
//         if (!isSignUp) {
//           setMessage("Sign-in successful!")
//           setIsError(false)

//           const userData = {
//             name: formData.name || "John Farmer",
//             username: formData.username,
//             phone: formData.phone || "+91 98765 43210",
//             areaVillage: formData.areaVillage || "Green Valley Village",
//             pincode: formData.pincode || "123456",
//             state: formData.state || "Maharashtra",
//           }
//           onSignIn(userData)
//           setIsLoading(false)
//           return
//         }

//         console.error("Error", error.message)
//         setMessage("Network error. Please try again later.")
//         setIsError(true)
//       }
//     } finally {
//       setIsLoading(false)
//     }
//   }

//   // Function to toggle password visibility
//   const togglePasswordVisibility = (field: string) => {
//     if (field === "password") {
//       setPasswordVisible(!passwordVisible)
//     } else if (field === "rePassword") {
//       setRePasswordVisible(!rePasswordVisible)
//     }
//   }

//   // Common input field component
//   const InputField = ({ label, id, name, type, placeholder, required }: any) => (
//     <div className="space-y-2">
//       <label htmlFor={id} className="block text-sm font-medium text-gray-700">
//         {label} *
//       </label>
//       <input
//         type={type}
//         id={id}
//         name={name}
//         value={formData[name as keyof typeof formData] as string}
//         onChange={handleChange}
//         required={required}
//         className="w-full px-4 py-3 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300 placeholder-gray-400"
//         placeholder={placeholder}
//       />
//     </div>
//   )

//   // Render the sign-up form
//   const renderSignUpForm = () => (
//     <>
//       <div className="space-y-2 mb-8">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Get Started Now</h1>
//         <p className="text-gray-500 text-base sm:text-lg">Quick & easy farmer registration.</p>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//           <InputField
//             label="Name (as per AADHAAR)"
//             id="name"
//             name="name"
//             type="text"
//             placeholder="Enter your full name"
//             required
//           />
//           <InputField
//             label="Username"
//             id="username"
//             name="username"
//             type="text"
//             placeholder="Choose a unique username"
//             required
//           />
//           {/* Password Fields */}
//           <div className="space-y-2">
//             <label htmlFor="password" className="block text-sm font-medium text-gray-700">
//               Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={passwordVisible ? "text" : "password"}
//                 id="password"
//                 name="password"
//                 value={formData.password}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
//                 placeholder="Create a password"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 onClick={() => togglePasswordVisibility("password")}
//               >
//                 {passwordVisible ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>
//           <div className="space-y-2">
//             <label htmlFor="reEnterPassword" className="block text-sm font-medium text-gray-700">
//               Re-enter Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={rePasswordVisible ? "text" : "password"}
//                 id="reEnterPassword"
//                 name="reEnterPassword"
//                 value={formData.reEnterPassword}
//                 onChange={handleChange}
//                 required
//                 className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
//                 placeholder="Re-enter your password"
//               />
//               <button
//                 type="button"
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//                 onClick={() => togglePasswordVisibility("rePassword")}
//               >
//                 {rePasswordVisible ? "🙈" : "👁️"}
//               </button>
//             </div>
//           </div>
//           <div className="sm:col-span-2">
//             <InputField
//               label="Phone Number"
//               id="phone"
//               name="phone"
//               type="tel"
//               placeholder="+91 XXXXX XXXXX"
//               required
//             />
//           </div>
//         </div>

//         <div className="space-y-4 pt-4">
//           <h2 className="text-lg font-semibold text-gray-900">Address Details</h2>
//           <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
//             <div className="sm:col-span-2">
//               <InputField
//                 label="Area/Village"
//                 id="areaVillage"
//                 name="areaVillage"
//                 type="text"
//                 placeholder="Enter your Area/Village"
//                 required
//               />
//             </div>
//             <InputField label="Pincode" id="pincode" name="pincode" type="text" placeholder="123456" required />
//             <InputField label="State" id="state" name="state" type="text" placeholder="Enter your state" required />
//           </div>
//         </div>

//         <div className="flex items-start space-x-3 pt-4">
//           <input
//             type="checkbox"
//             id="agreedToTerms"
//             name="agreedToTerms"
//             checked={formData.agreedToTerms}
//             onChange={handleChange}
//             required
//             className="mt-1 h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//           />
//           <label htmlFor="agreedToTerms" className="text-sm text-gray-600 leading-relaxed">
//             I agree to the{" "}
//             <a href="#" className="text-green-600 font-medium hover:underline">
//               terms & policy
//             </a>
//           </label>
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 px-4 bg-green-700 hover:bg-green-800 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
//         >
//           {isLoading ? "Signing up..." : "Signup"}
//         </button>
//       </form>

//       {/* Or Separator and Social Buttons - common for both forms */}
//       <div className="flex items-center my-4">
//         <div className="flex-grow border-t border-gray-300"></div>
//         <span className="flex-shrink mx-4 text-gray-500 font-medium">Or</span>
//         <div className="flex-grow border-t border-gray-300"></div>
//       </div>

//       <div className="flex flex-col sm:flex-row gap-4">
//         <button
//           type="button"
//           className="w-full py-3 px-4 flex items-center justify-center space-x-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition duration-300"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//             <path
//               d="M12.0001 4.75C14.735 4.75 17.027 5.766 18.6657 7.42437L20.5962 5.51351C18.2393 3.12527 15.1102 1.75 12.0001 1.75C8.80709 1.75 5.75336 2.9497 3.49392 5.27643L5.62934 7.43389C7.4727 5.61868 9.68961 4.75 12.0001 4.75Z"
//               fill="#EA4335"
//             />
//             <path
//               d="M22.0805 12.0001C22.0805 11.3284 22.0294 10.6695 21.921 10.0195H12.0001V13.9995H17.5147C17.3073 15.0258 16.6573 16.3262 15.5393 17.1594L17.7001 18.995C19.8653 17.0694 21.1396 14.5082 21.7337 12.0001H22.0805Z"
//               fill="#4285F4"
//             />
//             <path
//               d="M3.49392 5.27643L1.3585 3.11897C0.844116 4.19503 0.174776 5.65874 0.059495 7.15654H3.88291C4.0152 6.55134 4.31464 5.97549 4.76785 5.52622C5.22105 5.07695 5.76074 4.76735 6.36015 4.59567C6.95955 4.42399 7.59258 4.39461 8.22557 4.50853C8.85856 4.62245 9.47192 4.88145 10.021 5.26941L7.88556 7.43387C7.57943 7.2343 7.2519 7.08638 6.90998 6.99616C6.56807 6.90595 6.21639 6.87413 5.86976 6.89972C5.52313 6.92531 5.18349 7.00845 4.86765 7.14515C4.55182 7.28185 4.26252 7.47053 4.01831 7.69992L3.49392 5.27643Z"
//               fill="#FBBC04"
//             />
//             <path
//               d="M12.0001 22.25C14.7176 22.25 17.1824 21.288 19.068 19.6644L17.7002 18.9952C16.3686 20.2195 14.3168 21.0001 12.0001 21.0001C8.82885 21.0001 6.13458 19.0207 4.96062 16.2736L2.83984 18.4215C3.89622 20.9329 5.82025 22.25 8.80709 22.25C9.84975 22.25 10.925 22.0913 12.0001 21.8485V22.25Z"
//               fill="#34A853"
//             />
//           </svg>
//           <span>Sign up with Google</span>
//         </button>
//         <button
//           type="button"
//           className="w-full py-3 px-4 flex items-center justify-center space-x-2 border-2 border-gray-300 rounded-xl hover:bg-gray-50 transition duration-300"
//         >
//           <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
//             <path
//               d="M22.0001 12C22.0001 17.5228 17.523 22 12.0001 22C6.47726 22 2.00012 17.5228 2.00012 12C2.00012 6.47715 6.47726 2 12.0001 2C17.523 2 22.0001 6.47715 22.0001 12Z"
//               fill="#0A66C2"
//             />
//             <path
//               d="M16.602 9.09849V17.0001H13.8824V11.8349C13.8824 11.0261 13.5658 10.5186 12.8715 10.5186C12.1287 10.5186 11.6963 11.107 11.6963 12.0726V17.0001H16.602Z"
//               fill="white"
//             />
//             <path
//               d="M6.35783 7.82862C7.14321 7.82862 7.77708 7.19475 7.77708 6.40938C7.77708 5.62401 7.14321 4.99014 6.35783 4.99014C5.57245 4.99014 4.93858 5.62401 4.93858 6.40938C4.93858 7.19475 5.57245 7.82862 6.35783 7.82862Z"
//               fill="white"
//             />
//             <path d="M4.97571 9.09849H7.72265V17.0001H4.97571V9.09849Z" fill="white" />
//           </svg>
//           <span>Sign up with LinkedIn</span>
//         </button>
//       </div>
//       <div className="text-center text-sm text-gray-500 pt-6">
//         Already have an account?{" "}
//         <span className="text-green-600 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(false)}>
//           Sign In
//         </span>
//       </div>
//     </>
//   )

//   // Render the sign-in form
//   const renderSignInForm = () => (
//     <>
//       <div className="space-y-2 mb-8">
//         <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sign in to your account</h1>
//         <p className="text-gray-500 text-base sm:text-lg">Welcome back, farmer!</p>
//       </div>
//       <form onSubmit={handleSubmit} className="space-y-6">
//         <InputField
//           label="Username"
//           id="signin-username"
//           name="username"
//           type="text"
//           placeholder="Enter your username"
//           required
//         />
//         <div className="space-y-2">
//           <label htmlFor="signin-password" className="block text-sm font-medium text-gray-700">
//             Password *
//           </label>
//           <div className="relative">
//             <input
//               type={passwordVisible ? "text" : "password"}
//               id="signin-password"
//               name="password"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 pr-12 border-2 border-green-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all duration-300"
//               placeholder="Enter your password"
//             />
//             <button
//               type="button"
//               className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
//               onClick={() => togglePasswordVisibility("password")}
//             >
//               {passwordVisible ? "🙈" : "👁️"}
//             </button>
//           </div>
//         </div>
//         <button
//           type="submit"
//           disabled={isLoading}
//           className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-[1.02] disabled:transform-none"
//         >
//           {isLoading ? "Signing in..." : "Sign In"}
//         </button>
//       </form>
//       <div className="text-center text-sm text-gray-500 pt-6">
//         Don't have an account?{" "}
//         <span className="text-green-600 font-medium cursor-pointer hover:underline" onClick={() => setIsSignUp(true)}>
//           Sign Up
//         </span>
//       </div>
//     </>
//   )

//   return (
//     <div className="bg-gradient-to-br from-green-50 to-emerald-100 min-h-screen flex items-center justify-center p-4 sm:p-6">
//       <div className="flex flex-col lg:flex-row w-full max-w-5xl bg-white rounded-3xl shadow-2xl overflow-hidden">
//         {/* Left Side: Form */}
//         <div className="w-full lg:w-1/2 p-6 sm:p-10">
//           {isSignUp ? renderSignUpForm() : renderSignInForm()}

//           {/* Loading and status message display */}
//           {isLoading && (
//             <div className="mt-4 text-center py-3 px-4 rounded-xl bg-green-50 text-green-700 border border-green-200">
//               Loading...
//             </div>
//           )}
//           {message && !isLoading && (
//             <div
//               className={`mt-4 text-center py-3 px-4 rounded-xl border ${
//                 isError ? "bg-red-50 text-red-700 border-red-200" : "bg-green-50 text-green-700 border-green-200"
//               }`}
//             >
//               {message}
//             </div>
//           )}
//         </div>

//         {/* Right Side: Image */}
//         <div className="w-full lg:w-1/2 hidden lg:block relative">
//           <img
//             src="/fern-background-nature-green.jpg"
//             alt="Green Nature Background"
//             className="w-full h-full object-cover"
//           />
//           <div className="absolute inset-0 bg-green-900 bg-opacity-20"></div>
//         </div>
//       </div>
//     </div>
//   )
// }

// export default Signin_up
