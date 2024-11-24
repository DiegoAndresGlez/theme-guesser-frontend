/* eslint-disable no-unused-vars */
import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AlertModal from "./components/AlertModal";
import Title from "./components/Title"
import InfoComponent from "./InfoComponent";
import socket from './utils/socket'

/**
 * @typedef {Object} Player
 * @property {string} id // probably not going to be used, as username is already a unique identifier
 * @property {string} username
 * @property {string} role // "drawer" "guesser" "spectator"
 * @property {string} isHost // 1 is true 0 is false (best way to save booleans in Redis)
 * @property {number} score
 * @property {string} joinedAt
 * @property {Promise<Player>}
 */

const JoinCreateGame = ({ username }) => {
  const serverUrl = import.meta.env.VITE_BACKEND_URL;
  const [roomCodeField, setRoomCodeField] = useState("")
  const [roomCode, setRoomCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [isLoadingJoin, setIsLoadingJoin] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);
  const [playerName, setPlayerName] = useState(username) // pass in authenticated username
  const [copied, setCopied] = useState(false); // New state for copy confirmation
  const navigate = useNavigate();

  // Just generate temporary unique username
  const generateUsername = () => {
    const username = Math.random().toString(36).substr(2, 6).toUpperCase();
    console.error(username)
    setPlayerName(username.toString())
  };

  const handleCreateGameRoom = async () => {
    if (!playerName.trim()){
      setAlertMessage("You are not authenticated. Please try logging in.")
      setAlertVisible(true)
      return
    }

    setLoading(true);

    try {
      const response = await axios.post(`${serverUrl}/api/game/game-room`);

      if(!response.ok){
        setAlertMessage(`Error when trying to create game room ${roomCodeField}. Please try again later.`);
        setAlertVisible(true);
      }

      const { accessCode } = response.data;
      setRoomCode(accessCode);

      localStorage.setItem('playerInfo', JSON.stringify({
        username: playerName, // TODO: Set this username in user item in auth useEffect for easy access
        role: "guesser",
        isHost: 1,
        score: 0,
        roomCode: accessCode,
      }))

      navigate(`/game-room`)
    } catch (error) {
      console.error('Error creating game room:', error);
    }
    setLoading(false);
  };

  const handleJoinGame = async () => {
    if (!playerName.trim()) {
      setAlertMessage("You are not authenticated. Please try logging in.")
      setAlertVisible(true);
    }

    if (!roomCodeField.trim()) {
      setAlertMessage(`A game room code is required to join a game.`);
      setAlertVisible(true);
      return;
    }

    if (roomCodeField.trim().length > 6){
      setAlertMessage(`Game room code is above 6 characters. Please enter a valid game room code.`);
      setAlertVisible(true);
      return
    }

    setIsLoadingJoin(true)

    try {
      const response = await axios.get(`${serverUrl}/api/game/game-room/${roomCodeField}`);

      localStorage.setItem('playerInfo', JSON.stringify({
        username: playerName, // TODO: Set this username in another user item in auth useEffect for easy access and save that to here
        role: "drawer",
        isHost: 0,
        score: 0,
        roomCode: roomCodeField,
      }))

      navigate(`/game-room`)
    } catch (error) {
      setAlertMessage(`Error when trying to join game room: ${roomCodeField}. Please try again later.`);
      setAlertVisible(true);
      console.error('Error joining game:', error)
    }
    setIsLoadingJoin(false)
  };

  const handleCopyCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode)
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
      <Title message="Untitled"/>
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
          <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">
            Start playing!
          </CardHeader>
          <CardBody className="flex flex-col gap-6 p-4">
            <Input
              color="primary"
              clearable
              underlined
              type="text"
              placeholder="Enter Game Room Code"
              value={roomCodeField}
              onChange={(e) => setRoomCodeField(e.target.value)}
            />

            {roomCode && (
              <div className="text-center text-accent">
                Your Game Room Code: <strong>{roomCode}</strong>
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
                disabled={isLoadingJoin}
              >
                {isLoadingJoin ? (
                  <Spinner size="sm" className="mr-1 secondary" />
                ) : (
                  "Join Game"
                )}
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
