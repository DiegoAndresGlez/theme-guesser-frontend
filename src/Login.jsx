import { useNavigate } from "react-router-dom"
import AlertModal from "./components/AlertModal"
import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import Title from "./components/Title"
import InfoComponent from "./InfoComponent";
import supabase from './config/supabaseClient'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false)
  const navigate = useNavigate()
  let errors = []

  const handleValidations = () => {
      if (password === "") {
        errors.push("Password is empty.")
      }

      if (email === "") {
        errors.push("Email is empty.")
      }

      if (errors.length > 0) {
        throw new Error(errors.join(" ")); // Concatenate error messages with space
      }

      setAlertMessage(errors)
  }

  const handleLogin = async () => {
    setLoading(true)
    
    try {
      handleValidations()

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      })

      if (error) {
        throw new Error(error.message)
      }

      // Handle successful login, e.g. save token or redirect
      setAlertMessage(data.message || "Login successful!")
      setAlertVisible(true)
      setTimeout(() => {
        navigate(`/join-create-game`)
      }, 2000)


    } catch(error) {
      console.log(error)
      // Get error messages from backend validations and display them
      setAlertMessage(error.message || "Failed to log in...")
      setAlertVisible(true)
      setLoading(false)
    }

    setLoading(false)
  }

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

  const handleSignUp = () => {
    navigate("/signup")
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
      <Title message="Untitled"/>
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
            <p className="text-sm text-accent cursor-pointer hover:underline" onClick={() => { navigate('/forgot-password')}}>Forgot password?</p>
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
              disabled={loading}
            >
             {loading ? (
                <Spinner size="sm" className="mr-1 secondary" />
              ) : (
                "Login"
              )}
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