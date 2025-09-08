import './App.css';
import Signin_up from './components/Signin-up';

function App() {
  // Define the onSignIn function that the Signin_up component needs.
  // This function will handle the user data after a successful login.
  const handleSignIn = (userData: any) => {
    console.log("User signed in with data:", userData);
    // You can add your logic here to change the application state,
    // like setting a user as logged in or navigating to a new page.
  };

  return (
    // Pass the handleSignIn function to the onSignIn prop
    <Signin_up onSignIn={handleSignIn} />
  );
}

export default App;