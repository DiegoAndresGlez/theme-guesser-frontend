import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Input, Button, Divider } from "@nextui-org/react";
import socket from './utils/socket'
import GameRoomCanvas from './components/game-room-page/GameRoomCanvas';
import GameRoomChat from './components/game-room-page/GameRoomChat';
import GameRoomHeader from './components/game-room-page/GameRoomHeader';
import GameRoomPlayers from './components/game-room-page/GameRoomPlayers';
import { useNavigate } from 'react-router-dom';

const GameRoom = () => {

  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get player info from localStorage
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'))

    if (!playerInfo) {
      // TODO: Alert message
      console.error('Could not retrieve player info... Returning to join-create game page...')
      return
    }

    socket.connect()

    // Emitting to join room
    socket.emit('join-room', playerInfo.roomCode)

    // Events to listen on client side (react)
    socket.on('room-joined', (roomData) => {
      setRoom(roomData)
      setCurrentPlayer(roomData.players.find(p => p.id === socket.id))
    })

    socket.on('room-updated', (roomData) => {
      setRoom(roomData)
    })

    socket.on('game-started', (gameData) => {
      setRoom(prev => ({ ...prev, gameState: gameData }));
    });

    socket.on('timer-update', (time) => {
      setTimeLeft(time);
    });

    socket.on('error', (errorMessage) => {
      setError(errorMessage);
      // Navigate away if it's a fatal error
      if (errorMessage === 'Room not found') {
        localStorage.removeItem('playerInfo');
        navigate('/join-game-room');
      }
    });

    return () => {
      if (socket) {
        socket.disconnect()
      }
    }

  }, [socket]);

  const connectSocket = () => {
    if (!socket.connected) {
      socket.connect();  // Only connect if the socket is not already connected
    }
  };

  const handleStartGame = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (playerInfo?.isHost) {
      socket.emit('start-game', { roomCode: playerInfo.roomCode });
    }
  };

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  return (
    <div className="w-full min-h-screen p-4">
      <GameRoomHeader
        roomCode={room?.roomCode}
        timeLeft={timeLeft}
        isHost={currentPlayer?.isHost}
        onStartGame={handleStartGame}
      />

      {/* Main Game Area */}
      <div className="flex gap-4">
        {/* Player scores */}
        <GameRoomPlayers
          players={room?.players || []}
        />
        {/* Drawing Canvas Component */}
        <GameRoomCanvas
          isDrawing={room?.gameState?.currentDrawer === socket.id}
          word={room?.gameState?.currentWord}
        />
        {/* Chat Area COMPONENT */}
        <GameRoomChat
          roomCode={room?.code}
          playerName={currentPlayer?.username}
        />
      </div>
    </div>
  );
};

export default GameRoom;