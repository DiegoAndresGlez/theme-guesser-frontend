import React from 'react';
import { Textarea, Input, Button, Spacer } from '@nextui-org/react';
import InfoComponent from './InfoComponent';

const LoginPage = () => {
  const aboutContent = [
    'Untitled is an online multiplayer drawing and Pictionary guessing game that uses AI to generate theme-based words!',
    'A typical game consists of three rounds. At the start, players type in their chosen theme and vote for the most exciting and fun option. The AI then generates words based on the selected theme. A player draws their chosen word while others try to guess it to earn points.',
    'The player with the most points at the end of the game wins!'
  ];

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="flex flex-col items-center justify-center bg-dark-blue rounded-lg p-8 max-w-md mx-auto shadow-lg border-2 border-gray-300">
        {/* LOGIN */}
        <h2 className="text-2xl font-bold text-white mb-4">Welcome!</h2>

        <Input
          clearable
          underlined
          labelPlaceholder="Username"
          className="mb-4"
        />
        <Input
          clearable
          underlined
          labelPlaceholder="Password"
          type="password"
          className="mb-8"
        />

        <Button
          shadow
          color="primary"
          auto
          className="w-full mb-4"
        >
          Sign Up
        </Button>
        <Button
          shadow
          color="success"
          auto
          className="w-full"
        >
          Login
        </Button>

        {/* INFO */}
        <InfoComponent title="About" content={aboutContent} />
      </div>
    </div>
  );
};

export default LoginPage;
