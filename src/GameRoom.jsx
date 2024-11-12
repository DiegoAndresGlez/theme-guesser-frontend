import { useState, useEffect } from 'react';
import socket from './utils/socket'
import GameRoomCanvas from './components/game-room-page/GameRoomCanvas';
import GameRoomChat from './components/game-room-page/GameRoomChat';
import GameRoomHeader from './components/game-room-page/GameRoomHeader';
import GameRoomPlayers from './components/game-room-page/GameRoomPlayers';
import { useNavigate } from 'react-router-dom';
import { GameRoomState } from './utils/GameRoomState';
import ThemeInputModal from './components/game-room-page/ThemeInputModal';

const GameRoom = () => {

  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(null);
  const [timeLeft, setTimeLeft] = useState(60);

  // Input theme modal
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [hasSubmittedTheme, setHasSubmittedTheme] = useState(false);

  // Error messages from emitted by front/back
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

    const handleRoomJoined = (roomData) => {
      setRoom(roomData);
      const player = roomData.players.find(p => p.username === playerInfo.username);
      setCurrentPlayer(player);
      localStorage.setItem('playerInfo', JSON.stringify({
        ...playerInfo,
        isHost: player.isHost
      }));
    }

    const handleRoomUpdated = (roomData) => {
      setRoom(roomData);
      const updatedPlayer = roomData.players.find(p => p.username === playerInfo.username);
      if (updatedPlayer) {
        setCurrentPlayer(updatedPlayer);
        // Update localStorage to reflect any changes in host status
        localStorage.setItem('playerInfo', JSON.stringify({
          ...playerInfo,
          isHost: updatedPlayer.isHost
        }));
      }
    }

    const handleStartGame = () => {
      const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
      if (playerInfo?.isHost === "1") {
        console.log('Host initiating game start');
        socket.emit('start-game', { 
          roomCode: playerInfo.roomCode  // accessCode in backend
        });
      }
    };
    
    const handleHostChanged = ({ newHost }) => {
      setRoom(prev => {
        if (!prev) return null;
        const updatedPlayers = prev.players.map(p => ({
          ...p,
          isHost: p.username === newHost ? "1" : "0"
        }));
        return { ...prev, players: updatedPlayers };
      });

      // Update current player's host status if they are the new host
      if (playerInfo.username === newHost) {
        setCurrentPlayer(prev => ({ ...prev, isHost: "1" }));
        localStorage.setItem('playerInfo', JSON.stringify({
          ...playerInfo,
          isHost: "1"
        }));
      }
    };

    const handlePlayerLeft = ({ username, updatedRoom }) => {
      setRoom(updatedRoom);
    };

    const handleRoomDeleted = () => {
      localStorage.removeItem('playerInfo');
      navigate('/join-create-game');
    }

    const handleGameStateChanged = (newState) => {
      console.log('Game state changed:', newState);
      setRoom(prev => {
        if (!prev) return null;
        
        switch (newState) {
          case GameRoomState.WAITING_FOR_HOST:
            return {
              ...prev,
              gameState: newState,
              currentSecretWord: "",
              roundNumber: 0
            };
            
          case GameRoomState.CHOOSING_THEME:
            return {
              ...prev,
              gameState: newState,
              themeOptions: prev.themeOptions || [] // Preserve theme options if they exist
            };
            
          case GameRoomState.GENERATING_SECRET_WORDS:
            return {
              ...prev,
              gameState: newState,
              currentSecretWord: "" // Clear any previous word
            };
            
          case GameRoomState.CHOOSING_WORD:
            return {
              ...prev,
              gameState: newState,
              wordOptions: prev.wordOptions || [] // Preserve word options if they exist
            };
            
          case GameRoomState.DRAWING:
            return {
              ...prev,
              gameState: newState,
              roundStartTime: Date.now() // Optional: track when drawing started
            };
            
          case GameRoomState.ENDING:
            return {
              ...prev,
              gameState: newState,
              currentSecretWord: "", // Clear the word when ending
              roundNumber: prev.roundNumber // Preserve the round number for final score
            };
            
          default:
            console.warn('Unknown game state:', newState);
            return { ...prev, gameState: newState };
        }
      });
    };

    const handleError = (errorMessage) => {
      setError(errorMessage)
      localStorage.removeItem('playerInfo')
      window.alert(errorMessage)
      navigate('/join-create-game')
    }

    socket.connect()

    // Emitting to join room
    socket.emit('join-room', playerInfo.roomCode, playerInfo.username)

    // Socket event listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-updated', handleRoomUpdated);
    socket.on('host-changed', handleHostChanged);
    socket.on('player-left', handlePlayerLeft);
    socket.on('room-deleted', handleRoomDeleted)
    socket.on('game-state-changed', handleGameStateChanged);
    socket.on('timer-update', setTimeLeft);
    socket.on('error', handleError);

    // Cleanup function
    return () => {
      // Unmount when disconnected
      if (playerInfo) {
        socket.emit('leave-room', {
          accessCode: playerInfo.roomCode,
          username: playerInfo.username
        });
      }
      
      socket.off('room-joined');
      socket.off('room-updated');
      socket.off('host-changed');
      socket.off('player-left');
      socket.off('room-deleted');
      socket.off('game-state-changed');
      socket.off('timer-update');
      socket.off('error');
      socket.disconnect();
    };
  }, [navigate]);

  // Effect to handle theme modal visibility
  useEffect(() => {
    if (room?.gameState === GameRoomState.CHOOSING_THEME.name && !hasSubmittedTheme) {
      console.log('Opening theme modal - Choosing theme state');
      setShowThemeModal(true);
    } else if (room?.gameState !== GameRoomState.CHOOSING_THEME.name) {
      setHasSubmittedTheme(false);
    }
  }, [room?.gameState, hasSubmittedTheme]);


  const handleThemeSubmit = (theme) => {
    console.log('Submitting theme:', theme);
    socket.emit('submit-theme', {
      theme: theme.trim(),
      accessCode: room?.accessCode,
      playerName: currentPlayer?.username
    });
    setHasSubmittedTheme(true);
    setShowThemeModal(false);
  };
  
  const handleStartGame = () => {
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
    if (playerInfo?.isHost === "1") {
      socket.emit('start-game', { accessCode: playerInfo.roomCode });
    }
  };

  // Handle manual leave (e.g., when clicking a leave button)
  const handleLeaveGame = () => {
    try {
      const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));
      if (playerInfo) {
        socket.emit('leave-room', {
          accessCode: playerInfo.roomCode,
          username: playerInfo.username
        });
        localStorage.removeItem('playerInfo'); // Clear player info
        navigate('/join-create-game');
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      navigate('/join-create-game'); // Navigate anyway in case of error
    }
  };
  

  if (error) {
    <div className="flex h-screen items-center justify-center">
      <div className="text-center text-red-600">{error}</div>
    </div>;
  }

  const isDrawer = currentPlayer?.role === "drawer";
  const isHost = currentPlayer?.isHost === "1";
  const canDraw = isDrawer && room?.gameState === GameRoomState.DRAWING.name;

  console.log('Game room state info: ', {
    isHost,
    currentPlayer,
    gameState: room?.gameState,
    roomData: room,
  })

  return (
    <div className="w-full min-h-screen p-4">
      <ThemeInputModal
        isOpen={showThemeModal}
        onClose={() => {setShowThemeModal(false)}}
        onSubmit={handleThemeSubmit}
        size="md"
      />

      <GameRoomHeader
        roomCode={room?.accessCode}
        timeLeft={timeLeft}
        isHost={isHost}
        onStartGame={handleStartGame}
        roundNumber={room?.roundNumber}
        gameState={room?.gameState}
        onLeaveGame={handleLeaveGame}
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