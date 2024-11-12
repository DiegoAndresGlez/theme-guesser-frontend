import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { GameRoomState, GameRoomStateUtils } from '../../utils/GameRoomState';

const GameRoomHeader = ({
  roomCode,
  timeLeft,
  isHost,
  onStartGame,
  roundNumber,
  gameState,
  onLeaveGame
}) => {

    return (
        <>
        <h1 className="text-heading text-2xl font-bold">Theme Guesser</h1>

        <div className="flex gap-4 mb-4"> 
          {isHost && gameState === GameRoomState.WAITING_FOR_HOST.name && (
            <Button onClick={onStartGame} classNaroomCodeme="w-80 h-20">START</Button>
          )}
  
          {/* Second Header Card */}
          <Card className="flex-1">
            <CardBody>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-xm text-gray-500">{GameRoomStateUtils.getStateLabel(gameState)}</p>
                  <p className="text-xl text-gray-500">Room Code: #{roomCode}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Round</p>
                    <p className="text-lg font-semibold">{roundNumber || 0}/3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-lg font-semibold">{timeLeft}</p>
                  </div>
                  <Button onClick={onLeaveGame} color="primary" size="sm">
                    Leave Game
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        </>
    )
}

export default GameRoomHeader