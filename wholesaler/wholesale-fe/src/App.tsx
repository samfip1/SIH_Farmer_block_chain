import WholesalerAuth from "./components/Signin_in"

export default function Page() {
  const handleSignIn = (userData: any) => {
    console.log("User signed in:", userData)
    // Handle successful sign-in here
  }

  return <WholesalerAuth onSignIn={handleSignIn} />
}
