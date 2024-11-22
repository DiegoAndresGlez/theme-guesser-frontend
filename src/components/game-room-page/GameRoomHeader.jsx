import { useEffect, useState } from "react";
import { Card, CardBody, Spinner } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import { GameRoomState, GameRoomStateUtils } from '../../utils/GameRoomState';
import socket from "../../utils/socket";

const GameRoomHeader = ({
  roomCode,
  isHost,
  onStartGame,
  roundNumber,
  gameState,
  onLeaveGame,
  currentWord,
  isDrawer,
}) => {
  // Timer for drawing
  const [timeRemaining, setTimeRemaining] = useState(80);
  const [totalTime, setTotalTime] = useState(80)

  useEffect(() => {
    // Listen for timer updates from server
    socket.on('timer-update', ({ timeRemaining, totalTime }) => {
      setTimeRemaining(timeRemaining);
      setTotalTime(totalTime);
    });

    // Cleanup listener when component unmounts
    return () => {
      socket.off('timer-update');
    };
  }, []);

  // Function to get masked word
  const getMaskedWord = () => {
    if (!currentWord) return '';
    if (isDrawer) return currentWord;

    // For guessers, mask each word but preserve spaces
    return currentWord.split(' ')
      .map(word => '_'.repeat(word.length))
      .join(' ');
  };

  // Format round number for display
  const displayRoundNumber = () => {
    const round = parseInt(roundNumber || 0);
    return `${round}/3`;
  };

  return (
    <>
      <h1 className="font-heading text-5xl mb-2 text-accent font-bold">Untitled</h1>      
      <div className="flex gap-4 mb-4">
        {isHost && gameState === GameRoomState.WAITING_FOR_HOST.name && (
          <Button onClick={onStartGame} className="w-80 h-20 bg-green-500 text-white rounded-3xl font-bold text-1xl">START</Button>
        )}

        <Card className="flex-1 bg-divider-500 rounded-3xl">
          <CardBody>
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-xm text-white">{GameRoomStateUtils.getStateLabel(gameState)}</p>
                  { gameState === GameRoomState.CHOOSING_THEME.name || gameState === GameRoomState.CHOOSING_WORD.name && (
                    <Spinner size="sm"/>
                  )}
                  <p className="text-xl text-white">Room Code: #{roomCode}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-sm text-white">Round</p>
                    <p className="text-lg font-semibold">{displayRoundNumber()}</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-white">Time Left</p>
                    <p className="text-lg font-semibold">{timeRemaining || 0}</p>
                  </div>
                  <Button onClick={onLeaveGame} color="primary" size="sm">
                    Leave Game
                  </Button>
                </div>
              </div>

              {/* Show word section for both drawer and guessers when in DRAWING state */}
              {gameState === GameRoomState.DRAWING.name && (
                <div className="flex justify-center items-center">
                  <div className="text-center">
                    <p className="text-sm text-white mb-2">
                      {isDrawer ? 'Your word to draw:' : 'Current word:'}
                    </p>
                    <div className="flex gap-2 justify-center">
                      {getMaskedWord().split('').map((char, index) => (
                        <span
                          key={index}
                          className={`
                              ${char === ' ' ? 'w-4' : 'w-6'}
                              text-center font-mono text-xl
                              ${char === '_' ? 'border-b-2 border-primary' : ''}
                            `}
                        >
                          {char}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default GameRoomHeader;