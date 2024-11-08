import React from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Input, Button, Divider } from "@nextui-org/react";
// import GameRoomHeader, GameRoomCanvas, GameRoomChat, GameRoomPlayers

const GameRoom = () => {
  const players = []

  return (
	  <div className="w-full min-h-screen p-4">
		  <h1 className="text-2xl font-bold">Theme Guesser</h1>
		  {/* Top Header Area with Two Cards */}
		  <div className="flex gap-4 mb-4">
			  <Button className='w-80 h-20' >
				START
			  </Button>
			  {/* <Card className="w-80">
			  </Card> */}

			  {/* Second Header Card */}
			  <Card className="flex-1">
				  <CardBody>
					  <div className="flex justify-between items-center">
						  <div className="space-y-1">
							  <p className="text-2xl text-gray-500">Room Code: #ABC123</p>
						  </div>
						  <div className="flex gap-4 items-center">
							  <div className="text-center">
								  <p className="text-sm text-gray-500">Round</p>
								  <p className="text-lg font-semibold">2/5</p>
							  </div>
							  <div className="text-center">
								  <p className="text-sm text-gray-500">Time Left</p>
								  <p className="text-lg font-semibold">60s</p>
							  </div>
							  <Button color="primary" size="sm">
								  Leave Game
							  </Button>
						  </div>
					  </div>
				  </CardBody>
			  </Card>
		  </div>

      {/* Main Game Area */}
	  <div className="flex gap-4">
        {/* Player Cards Stack */}
        <div className="w-80 space-y-2">
          {/* <h2 className="text-xl font-bold mb-2">Players</h2> */}
          {players.map((player) => (
            <Card key={player.name} className="w-full">
              <CardBody>
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">
                      {player.name} {player.isDrawing && "✏️"}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-primary">{player.score}</span>
                    <span className="text-sm text-gray-500">pts</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}
          {players.length < 5 && (
            <Card className="w-full border-2 border-dashed">
              <CardBody>
                <div className="flex justify-center items-center text-gray-500">
                  <span className="text-sm">{5 - players.length} slots available</span>
                </div>
              </CardBody>
            </Card>
          )}
        </div>

        {/* Drawing Canvas Area TODO MAKE COMPONENT */}
        <Card className="flex-1">
          <CardBody>
            <div className="w-full h-[500px] bg-white border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
              Canvas Area
            </div>
          </CardBody>
        </Card>

        {/* Chat Area TODO MAKE COMPONENT */}
        <Card className="w-80">
          <CardHeader className="font-bold">Chat</CardHeader>
          <Divider/>
          <CardBody>
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Player 1:</span> Is it a dog?
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Player 2:</span> Looks like a cat!
                </div>
                <div className="text-sm text-blue-500">
                  Player 3 is getting closer!
                </div>
              </div>
              <div className="flex gap-2 py-3">
				<Input>
				</Input>
                <input
                  type="text"
                  placeholder="Type your guess..."
                  className="flex-1 px-3 py-2 bg-primary-600 text-accent border rounded-lg focus:outline-none focus:ring-2 focus:primary"
                />
              </div>
			<Button className="flex-l" color="primary" size="sm">
				Send
			</Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </div>
  );
};

export default GameRoom;