import { Button } from "@nextui-org/react";
import socket from "../../utils/socket";

// Separate PlayerActions component for cleaner organization
const PlayerActions = ({ player, currentPlayer, roomCode }) => {
  const isHost = currentPlayer?.isHost === "1";
  const isSelf = player.username === currentPlayer?.username;

  if (!isHost || isSelf) {
    return null;
  }

  const handleKickPlayer = () => {
    socket.emit('kick-player', {
      accessCode: roomCode,
      username: player.username
    });
  };

  return (
    <Button 
      variant="ghost" 
      size="sm"
      onClick={handleKickPlayer}
      className="text-red-600 hover:text-red-700 hover:bg-red-50 p-2 h-8"
    >
      Kick
    </Button>
  );
};

export default PlayerActions;