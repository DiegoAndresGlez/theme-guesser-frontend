import { useState } from "react";
import { useNavigate } from "react-router-dom"
import { Button, Input, Spinner } from "@nextui-org/react";
import AlertModal from "./AlertModal"
import InfoComponent from "./InfoComponent";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("http://localhost:3000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password })
      })

      const data = await response.json() 

      if (!response.ok) {
        // Get error messages from backend validations and display them
        const errorMessages = Object.values(data.errors).join(" ") 
        throw new Error(errorMessages)
      }

      navigate("/signup") // redirect to signup is an example, should point to join-create-game

      // Handle successful login, e.g. save token or redirect
      setAlertMessage(data.message || "Login successful! Redirecting...")
      setAlertVisible(true)

    } catch (error) {
      console.log("Login error: ", error)

      setAlertMessage(error.message || "Failed to log in. Please check your credentials.")
      setAlertVisible(true)

    } finally {
      setLoading(false)

    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

  const handleSignUp = () => {
    // logic
    // Redirect to /signup
  };

  const infoTitle = "About";
  const infoContent = [
    "Untitled is an online multiplayer drawing and Pictionary guessing game that uses AI to generate theme-based words!",
    "A typical game consists of three rounds. At the start, players type in their chosen theme and vote for the most exciting and fun option. The AI then generates words based on the selected theme. A player draws their chosen word while others try to guess it to earn points.",
    "The player with the most points at the end of the game wins!",
  ];

  return (
    <>
    {alertVisible && (< AlertModal 
      isOpen={alertVisible} 
      onClose={handleCloseAlert} 
      message={alertMessage}
      size="lg" />)}
    
    <div className="flex flex-col items-center min-h-screend text-white p-6 space-y-8">
      <div className="w-full max-w-md p-8 bg-darkBlue rounded-lg shadow-lg text-center space-y-6">
        <h2 className="text-2xl">Welcome!</h2>
        <div className="w-3/4 mx-auto space-y-6">
          <Input
            isRequired
            clearable
            underlined
            type="email"
            placeholder="Email"
            color="primary"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            type="password"
            placeholder="Password"
            color="primary"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* TODO: change to a Link or button */}
        <p className="text-sm text-blue-300 cursor-pointer">Forgot password?</p>
        <div className="flex justify-center w-full mt-4 space-x-4">
          <Button
            onClick={handleSignUp}
            className="w-auto"
          >
            Sign Up
          </Button>
          <Button
            onClick={handleLogin}
            className="w-auto bg-green-600"
            disabled={loading}
          >
            {loading ? <Spinner color="white" size="sm"/> : "Login"}
          </Button>
        </div>
      </div>

      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
    </>
  );
};

export default Login;