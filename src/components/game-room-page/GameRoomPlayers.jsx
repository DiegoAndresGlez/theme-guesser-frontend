import { useState, useEffect } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import socket from '../../utils/socket';

const GameRoomPlayers = ({ players, currentDrawerUsername }) => {
    // const [players, setPlayers] = useState([]);

    // useEffect(() => {
    //     // Listen for room updates which include player list changes
    //     socket.on('room-updated', (roomData) => {
    //         if (roomData.players) {
    //             setPlayers(roomData.players.map(player => ({
    //                 username: player.username,
    //                 score: player.score || 0,
    //                 isDrawing: roomData.gameState?.currentDrawer === player.id,
    //                 isHost: player.isHost
    //             })));
    //         }
    //     });

    //     // Listen for new player joins
    //     socket.on('player-joined', (playerData) => {
    //         setPlayers(prevPlayers => {
    //             // Check if player already exists
    //             if (prevPlayers.some(p => p.id === playerData.id)) {
    //                 return prevPlayers;
    //             }
    //             return [...prevPlayers, {
    //                 id: playerData.id,
    //                 name: playerData.username,
    //                 score: 0,
    //                 isDrawing: false,
    //                 isHost: playerData.isHost
    //             }];
    //         });
    //     });

    //     // Listen for player disconnections
    //     socket.on('player-left', (playerId) => {
    //         setPlayers(prevPlayers => prevPlayers.filter(p => p.id !== playerId));
    //     });

    //     // Listen for score updates
    //     socket.on('score-updated', ({ playerId, newScore }) => {
    //         setPlayers(prevPlayers => 
    //             prevPlayers.map(player => 
    //                 player.id === playerId 
    //                     ? { ...player, score: newScore }
    //                     : player
    //             )
    //         );
    //     });

    //     // Listen for drawer changes
    //     socket.on('drawer-changed', (drawerId) => {
    //         setPlayers(prevPlayers => 
    //             prevPlayers.map(player => ({
    //                 ...player,
    //                 isDrawing: player.id === drawerId
    //             }))
    //         );
    //     });

    //     // Cleanup function
    //     return () => {
    //         socket.off('room-updated');
    //         socket.off('player-joined');
    //         socket.off('player-left');
    //         socket.off('score-updated');
    //         socket.off('drawer-changed');
    //     };
    // }, []);

    return (
      <div className="w-80 space-y-2">
        {/* Player Cards */}
        {players.map((player) => (
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
                </div>
              </div>
            </CardBody>
          </Card>
        ))}

        {/* Available Slots Card */}
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
    );
};

export default GameRoomPlayers;