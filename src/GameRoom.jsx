import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Input, Button, Divider } from "@nextui-org/react";
import socketClient from './utils/socket'
import GameRoomCanvas from './components/game-room-page/GameRoomCanvas';
import GameRoomChat from './components/game-room-page/GameRoomChat';
import GameRoomHeader from './components/game-room-page/GameRoomHeader';
import GameRoomPlayers from './components/game-room-page/GameRoomPlayers';
import { string } from 'prop-types';
// import { GameRoomChat } from './components/game-room-page/GameRoomChat';
// import { GameRoomPlayers } from './components/game-room-page/GameRoomPlayers';

const GameRoom = ({ accessCode }) => {
  const socketRef = useRef(null)

  const [room, setRoom] = useState(null);
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  useEffect(() => {
    socketRef.current = socketClient

    socketRef.current.emit('join-game', accessCode)

    socketRef.current.on('connect', () => {
      console.log(`Connected to server:`, socketRef.current)
    })

    socketRef.current.on('connect-error', (error) => {
      console.error('Connection error:', error);
    });

    socketRef.current.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect()
        socketRef.current = null
      }
    }

  }, [socketRef]);

  const connectSocket = () => {
    if (!socketClient.connected) {
      socketClient.connect();  // Only connect if the socket is not already connected
    }
  };

  const handleStartGame = () => {
    if (room?.gameState.hostId === playerId) {
      socketRef.emit('start-game', { accessCode });
    }
  };

  const handleLeaveGame = () => {
    socketRef?.emit('leave-room', { accessCode, playerId });
  };

  return (
    <div className="w-full min-h-screen p-4">
      <GameRoomHeader/>

      {/* Main Game Area */}
      <div className="flex gap-4">
        {/* Player scores */}
        <GameRoomPlayers/>
        {/* Drawing Canvas Component */}
        <GameRoomCanvas/>
        {/* Chat Area COMPONENT */}
        <GameRoomChat/>
      </div>
    </div>
  );
};

GameRoom.propTypes = {
  accessCode: string,
}

export default GameRoom;