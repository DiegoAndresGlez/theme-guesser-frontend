import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import InfoComponent from "./InfoComponent";
import AlertModal from "./components/AlertModal";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import eyeIcon from "./assets/img/eye.png";
import blockedEyeIcon from "./assets/img/blocked-eye.png"; 

const SignUp = () => {
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [showPassword, setShowPassword] = useState(false)
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVisible, setAlertVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSignUp = async () => {
    setLoading(true)
    
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, email, password, confirmPassword })
      })

      const data = await response.json() 

      if (!response.ok) {
        console.log(data);
  
        let errorMessages = "";
  
        if (data.error) {
          // Single error message
          errorMessages = data.error;
        } else if (data.errors) {
          // Multiple errors, combine them into a single message string
          errorMessages = Object.values(data.errors).join(" ");
        } else {
          // Unexpected error format
          errorMessages = "An unknown error occurred. Please try again.";
        }
  
        throw new Error(errorMessages);
      }

      setAlertMessage("Your account has been successfully created! Try logging in")
      setAlertVisible(true)
      
    } catch (error) {
      setAlertMessage(error.message || "Failed to sign up...")
      setAlertVisible(true)

    } finally {
      setLoading(false)
    }
  };

  const handleBack = () => {
    navigate('/login') //
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

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
        <div>
          <ArrowLeftIcon 
            className="h-7 w-7 cursor-pointer text-accent hover:text-divider-500" 
            onClick={handleBack} 
          />
        </div>
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">Create an account</CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <Input
              color="secondary"
              isRequired
              clearable
              underlined
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              color="secondary"
              isRequired
              clearable
              underlined
              placeholder="Email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                color="secondary"
                isRequired
                clearable
                underlined
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                  src={showPassword ? blockedEyeIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
                  onClick={toggleShowPassword}
                />
            </div>
            <div className="relative">
              <Input
                color="secondary"
                isRequired
                clearable
                underlined
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img
                  src={showPassword ? blockedEyeIcon : eyeIcon}
                  alt={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
                  onClick={toggleShowPassword}
                />
            </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleSignUp}
              disabled={loading}
            >
              {loading ? (
                <Spinner size="sm" className="mr-1" color="white" />
              ) : (
                "Accept"
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

export default SignUp;
