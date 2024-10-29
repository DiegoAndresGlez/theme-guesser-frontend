import { useState } from "react";
import { useNavigate } from "react-router-dom"
import AlertModal from "./AlertModal"
import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
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
  }

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

  const handleSignUp = () => {
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
    
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">Welcome!</CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <Input
              isRequired
              clearable
              underlined
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              isRequired
              clearable
              underlined
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <p className="text-sm text-accent cursor-pointer hover:underline">Forgot password?</p>
          </div>
          
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto bg-secondary text-white rounded-lg font-semibold transition duration-300"
              onClick={handleSignUp}
            >
              Sign Up
            </Button>
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleLogin}
            >
              Login
            </Button>
          
          </div>
        </CardBody>
      </Card>

      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
    </>
  );
};

export default Login;