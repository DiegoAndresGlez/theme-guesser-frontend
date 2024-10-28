import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";

const Login = () => {
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
    <div className="flex flex-col items-center">
      <Card className="w-full max-w-md shadow-lg bg-primary">
        <CardHeader className="text-2xl">Welcome!</CardHeader>
        <CardBody className="mt-4">
          <div>
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
            {/* TODO: change to a Link or button */}
            <p>Forgot password?</p>
          </div>
          
          <div className="flex justify-center">
              <Button
                onClick={handleSignUp}
              >
                Sign Up
              </Button>
              <Button
                onClick={handleLogin}
              >
                Login
              </Button>
          </div>
        </CardBody>
      </Card>

      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
  );
};

export default Login;
