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
  onLeaveGame,
  currentWord,
  isDrawer,
}) => {
    // Function to get masked word
    const getMaskedWord = () => {
      if (!currentWord) return '';
      if (isDrawer) return currentWord;
      
      // For guessers, mask each word but preserve spaces
      return currentWord.split(' ')
        .map(word => '_'.repeat(word.length))
        .join(' ');
    };

    return (
        <>
        <h1 className="text-heading text-2xl font-bold">Theme Guesser</h1>
        <div className="flex gap-4 mb-4"> 
          {isHost && gameState === GameRoomState.WAITING_FOR_HOST.name && (
            <Button onClick={onStartGame} className="w-80 h-20">START</Button>
          )}
  
          <Card className="flex-1">
            <CardBody>
              <div className="flex flex-col space-y-4">
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

                {/* Show word section for both drawer and guessers when in DRAWING state */}
                {gameState === GameRoomState.DRAWING.name && (
                  <div className="flex justify-center items-center">
                    <div className="text-center">
                      <p className="text-sm text-gray-500 mb-2">
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