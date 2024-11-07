/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "./components/AlertModal";
import Title from "./components/Title"
import InfoComponent from "./InfoComponent";
import io from "socket.io-client";

const JoinCreateGame = () => {
  const serverUrl = import.meta.env.VITE_SERVER_URL;
  const [gameCode, setGameCode] = useState("");
  const [generatedCode, setAccessCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [copied, setCopied] = useState(false); // New state for copy confirmation
  // const navigate = useNavigate();
  const socket = io()

  const handleJoinGame = () => {
    if (gameCode.trim() === "") {
      setAlertMessage("Please enter a game room code to join.");
      setAlertVisible(true);
      return;
    }

    console.log("Attempting to join game with code:", gameCode);
  };

  const handleCreateGameRoom = async () => {
    setLoading(true);

    try {
      const response = await axios.post(`${serverUrl}/api/game/game-room`);
      const { accessCode } = response.data;

      setAccessCode(accessCode);
      socket.emit('join-room', accessCode);
    } catch (error) {
      console.error('Error creating game room:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    if (generatedCode) {
      navigator.clipboard.writeText(generatedCode)
        .then(() => {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        })
        .catch((err) => console.error("Failed to copy code: ", err));
    }
  };

  const handleCloseAlert = () => {
    setAlertVisible(false);
    setAlertMessage("");
  };

  const infoTitle = "About";
  const infoContent = [
    "Untitled is an online multiplayer drawing and Pictionary guessing game that uses AI to generate theme-based words!",
    "A typical game consists of three rounds. At the start, players type in their chosen theme and vote for the most exciting and fun option. The AI then generates words based on the selected theme. A player draws their chosen word while others try to guess it to earn points.",
    "The player with the most points at the end of the game wins!",
  ];

  return (
    <>
      {alertVisible && (
        <AlertModal
          isOpen={alertVisible}
          onClose={handleCloseAlert}
          message={alertMessage}
          size="lg"
        />
      )}

      <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Title message="Theme Guesser"/>
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
          <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">
            Start playing!
          </CardHeader>
          <CardBody className="flex flex-col gap-6 p-4">
            <Input
              clearable
              underlined
              type="text"
              placeholder="Enter Game Room Code"
              value={gameCode}
              onChange={(e) => setGameCode(e.target.value)}
            />

            {generatedCode && (
              <div className="text-center text-accent">
                Your Game Room Code: <strong>{generatedCode}</strong>
                <Button
                  auto
                  size="sm"
                  className="ml-2"
                  color="secondary"
                  onClick={handleCopyCode}
                >
                  {copied ? "Copied!" : "Copy"}
                </Button>
              </div>
            )}

            <div className="flex flex-col items-center gap-2">
              <Button
                className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
                onClick={handleJoinGame}
                disabled={loading}
              >
                Join Game
              </Button>
              <span className="text-gray-500 font-semibold">OR</span>
              <Button
                className="w-auto bg-secondary text-white rounded-lg font-semibold transition duration-300"
                onClick={handleCreateGameRoom}
                disabled={loading}
              >
                {loading ? (
                  <Spinner size="sm" className="mr-1 secondary" />
                ) : (
                  "Create Game Room"
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

export default JoinCreateGame;
