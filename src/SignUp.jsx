import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

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
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <div>
          <Button className="rounded-full h-12 w-12 bg-accent" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5"/>
          </Button>
        </div>
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">Create an account</CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="relative">
              <Input
                isRequired
                clearable
                underlined
                placeholder="Password"
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={`assets/img/${showPassword ? "assets/img/eye.png" : "assets/img/eye.png"}`}
                alt="Toggle password visibility"
                className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
            <div className="relative">
              <Input
                isRequired
                clearable
                underlined
                placeholder="Repeat Password"
                type={showPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <img
                src={`assets/img/${showPassword ? "assets/img/eye.png" : "assets/img/eye.png"}`}
                alt="Toggle password visibility"
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
            >
              Accept
            </Button>
          </div>
        </CardBody>
      </Card>

      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
  );
};

export default SignUp;
