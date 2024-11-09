import { useState, useEffect, useRef } from 'react';
import { Card, CardBody } from "@nextui-org/react";

// Players array
const GameRoomPlayers = () => {
    const [players, setPlayers] = useState([])
    return (
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
                    <span className="font-semibold text-primary">
                      {player.score}
                    </span>
                    <span className="text-sm text-gray-500">pts</span>
                  </div>
                </div>
              </CardBody>
            </Card>
          ))}

          {/* <GameRoomScores/> */}
          {players.length < 5 && (
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
    )
}

export default GameRoomPlayers