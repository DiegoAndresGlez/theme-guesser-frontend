import React, { useState } from "react";
import { Button, Input, Link } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    // logic
  };

  const handleSignUp = () => {
    // logic
  };

  const infoTitle = "About";
  const infoContent = [
    "Untitled is an online multiplayer drawing and Pictionary guessing game that uses AI to generate theme-based words!",
    "A typical game consists of three rounds. At the start, players type in their chosen theme and vote for the most exciting and fun option. The AI then generates words based on the selected theme. A player draws their chosen word while others try to guess it to earn points.",
    "The player with the most points at the end of the game wins!",
  ];

  return (
    <div className="flex flex-col items-center min-h-screen bg-blue-900 text-white p-6 space-y-8">
      <h1 className="text-4xl font-bold tracking-wide text-center mt-8 mb-12">UNTITLED</h1>
      
      <div className="w-full max-w-md p-8 bg-darkBlue rounded-lg shadow-lg text-center space-y-6">
        <h2 className="text-2xl">Welcome!</h2>
        <div className="w-full mb-4">
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
        </div>
        <div className="w-full mb-4">
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
            color="gradient"
            className="w-auto"
          >
            Sign Up
          </Button>
          <Button
            onClick={handleLogin}
            color="success"
            className="w-auto bg-green-500"
          >
            Login
          </Button>
        </div>
      </div>

      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
  );
};

export default LoginPage;
