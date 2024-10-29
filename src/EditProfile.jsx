import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import AlertModal from "./AlertModal"

const EditProfile = () => {
  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email@email.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmailChange, setCurrentPasswordForEmailChange] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [alertMessage, setAlertMessage] = useState("")
  const [alertVisible, setAlertVisible] = useState(false)
  const [loading, setLoading] = useState(false)
  const navigate = new useNavigate();

  const handleEmailChangeRequest = () => {
    // logic to save changes
  }

  const handlePasswordChange = async () => {
    setLoading(true)
    
    try {
      const response = await fetch("http://localhost:3000/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ currentPassword, newPassword, confirmNewPassword })
      })

      const data = await response.json() 

      if (!response.ok) {
        // Get error messages from backend validations and display them
        const errorMessages = Object.values(data.errors).join(" ") 
        console.log(errorMessages)
        throw new Error(errorMessages)
      }

      // Handle successful login, e.g. save token or redirect
      
      navigate("/join-create-game") // redirect to signup is an example, should point to join-create-game

    } catch (error) {

      setAlertMessage(error.message || "Failed to sign up...")
      setAlertVisible(true)

    } finally {
      setLoading(false)

    }
  }

  const handleBack = () => {
    // for back button
    navigate('/join-create-game')
  }

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  }

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

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
          <Button className="rounded-full bg-accent" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5"/>
          </Button>
        </div>
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">Edit Profile</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
          <Input
            isDisabled
            clearable
            underlined
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            isDisabled
            clearable
            underlined
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPasswordForEmailChange}
            onChange={(e) => setCurrentPasswordForEmailChange(e.target.value)}
          />
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300 my-3"
              color="success"
              onClick={handleEmailChangeRequest}
            >
              Request email change
            </Button>
          </div>
          <Divider color="divider"></Divider>
          <Input
            isRequired
            clearable
            underlined
            placeholder="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            className="mt-3"
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="New Password"
            type={showPassword ? "text" : "password"}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="Repeat New Password"
            type={showPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <label className="cursor-pointer text-sm text-gray-500" onClick={toggleShowPassword}>
              {showPassword ? "Hide Password" : "Show Password"}
            </label>
          </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handlePasswordChange}
            >
              Change password
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
    </>
  );
};

export default EditProfile;
