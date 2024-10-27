import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const SignUp = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSignUp = () => {
    // logic
  };

  const handleBack = () => {
    // logic for back button
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const infoTitle = "About";
  const infoContent = [
    "Untitled is an online multiplayer drawing and Pictionary guessing game that uses AI to generate theme-based words!",
    "A typical game consists of three rounds. At the start, players type in their chosen theme and vote for the most exciting and fun option. The AI then generates words based on the selected theme. A player draws their chosen word while others try to guess it to earn points.",
    "The player with the most points at the end of the game wins!",
  ];

  return (
    <div className="flex flex-col items-center min-h-screend text-white p-6 space-y-8">
      <div className="w-full max-w-md bg-darkBlue rounded-lg shadow-lg text-center">
        <div className="w-full flex justify-start pl-4 pt-4">
          <Button className="rounded-full h-10 w-10 flex items-center justify-center p-0" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <div className="w-3/4 mx-auto space-y-6 pb-8 pl-8 pr-8">
          <h2 className="text-2xl mt-0">Create an account</h2>
          <Input
            isRequired
            clearable
            underlined
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            isRequired
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
              placeholder="Password"
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Input
              isRequired
              clearable
              underlined
              placeholder="Repeat Password"
              type={showPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <div className="flex justify-between items-center">
                <label className="cursor-pointer text-sm text-gray-500" onClick={toggleShowPassword}>
                {showPassword ? "Hide Password" : "Show Password"}
                </label>
            </div>
          <Button onClick={handleSignUp} className="w-auto bg-green-600">
            Accept
          </Button>
        </div>
      </div>
      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
  );
};

export default SignUp;
