import { useState, useEffect, useRef } from 'react';
import { Card, CardBody, CardHeader } from "@nextui-org/react";
import { Input, Button, Divider } from "@nextui-org/react";
import socket from './utils/socket'
import GameRoomCanvas from './components/game-room-page/GameRoomCanvas';
import GameRoomChat from './components/game-room-page/GameRoomChat';
import GameRoomHeader from './components/game-room-page/GameRoomHeader';
import GameRoomPlayers from './components/game-room-page/GameRoomPlayers';
import { useNavigate } from 'react-router-dom';
import { GameRoomState } from './utils/GameRoomState';

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
      window.alert('Could not retrieve player info...')
      navigate('/join-create-game')
      return
    }

    socket.connect()

    // Emitting to join room
    socket.emit('join-room', playerInfo.roomCode, playerInfo.username)

    const handleRoomJoined = (roomData) => {
      setRoom(roomData)
      // Find current player using username as the unique identifier
      const player = roomData.players.find(p => p.username === playerInfo.username)
      setCurrentPlayer(player)
    }

    const handleRoomUpdated = (roomData) => {
      setRoom(roomData);
      // Update current player data if needed
      const updatedPlayer = roomData.players.find(p => p.username === playerInfo.username);
      if (updatedPlayer) {
        setCurrentPlayer(updatedPlayer);
      }
    }

    // Simply update the room's gameState to the new state
    const handleGameStateChanged = (newState) => {
      setRoom(prev => prev ? { ...prev, gameState: newState } : null);
    };

    const handleError = (errorMessage) => {
      // setError(errorMessage)
      // if (errorMessage === 'Room not found') {
      //   localStorage.removeItem('playerInfo')
      //   window.alert(errorMessage)
      //   navigate('/join-create-game')
      // }
    }

    // Socket event listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-updated', handleRoomUpdated);
    socket.on('game-state-changed', handleGameStateChanged);
    socket.on('timer-update', setTimeLeft);
    socket.on('error', handleError);

    // Cleanup function
    return () => {
      socket.off('room-joined', handleRoomJoined);
      socket.off('room-updated', handleRoomUpdated);
      socket.off('game-started', handleGameStateChanged);
      socket.off('timer-update', setTimeLeft);
      socket.off('error', handleError);
      socket.disconnect();
    };
  }, [navigate]);

  
  const handleStartGame = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (playerInfo?.isHost === "1") {
      socket.emit('start-game', { roomCode: playerInfo.roomCode });
    }
  };

  if (error) {
    return <div className="text-center text-red-600 mt-8">{error}</div>;
  }

  const isDrawer = currentPlayer?.role === "drawer";
  const isHost = currentPlayer?.isHost === "1";
  const canDraw = isDrawer && room?.gameState === GameRoomState.DRAWING;

  return (
    <div className="w-full min-h-screen p-4">
      <GameRoomHeader
        roomCode={room?.roomCode}
        timeLeft={timeLeft}
        isHost={isHost}
        onStartGame={handleStartGame}
        roundNumber={room?.roundNumber}
        gameState={room?.gameState}
      />

      <div className="flex gap-4">
        <GameRoomPlayers
          players={room?.players || []}
          currentDrawerUsername={
            room?.players?.find((p) => p.role === "drawer")?.username
          }
        />

        <GameRoomCanvas
          isDrawing={canDraw}
          word={room?.currentSecretWord}
          gameState={room?.gameState}
        />

        <GameRoomChat
          roomCode={room?.roomCode}
          playerName={currentPlayer?.username}
          isDrawing={isDrawer}
          currentWord={room?.currentSecretWord}
          gameState={room?.gameState}
        />
      </div>
    </div>
  );
};

export default GameRoom;