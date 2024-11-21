import { Card, CardBody } from "@nextui-org/react";
import PlayerActions from "./PlayerActions";

const GameRoomPlayers = ({ currentPlayer, players, currentDrawerUsername, roomCode }) => {
  return (
    <div className="w-80 space-y-2">
      {/* Player Cards */}
      {players?.map((player) => (
        <Card key={player.username} className="w-full">
          <CardBody>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <span className="font-medium">
                  {player.username}
                  {player.username === currentDrawerUsername && " ✏️"}
                  {player.isHost === "1" && " 👑"}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-primary">
                  {player.score || 0}
                </span>
                <span className="text-sm text-gray-500">pts</span>
                <PlayerActions 
                  player={player} 
                  currentPlayer={currentPlayer} 
                  roomCode={roomCode}
                />
              </div>
            </div>
          </CardBody>
        </Card>
      ))}
      {/* Available Slots Card */}
      {players && players.length < 5 && (
        <Card className="w-full border-2 border-dashed">
          <CardBody>
            <div className="flex justify-center items-center text-gray-500">
              <span className="text-sm">
                {5 - players.length} slots available
              </span>
            </div>
          </CardBody>
        </Card>
      )}
    </div>
  );
};

export default GameRoomPlayers;