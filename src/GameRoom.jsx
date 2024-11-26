import { useCallback, useState, useEffect } from 'react';
import GameRoomCanvas from './components/game-room-page/GameRoomCanvas';
import GameRoomChat from './components/game-room-page/GameRoomChat';
import GameRoomHeader from './components/game-room-page/GameRoomHeader';
import GameRoomPlayers from './components/game-room-page/GameRoomPlayers';
import { useNavigate } from 'react-router-dom';
import { GameRoomState } from './utils/GameRoomState';
import WordSelectionModal from './components/game-room-page/WordSelectionModal'
import ThemeInputModal from './components/game-room-page/ThemeInputModal';
import GameEndModal from './components/game-room-page/GameEndModal';
import WarningModal from './components/game-room-page/WarningModal';
import socket from './utils/socket';

const GameRoom = () => {
  const navigate = useNavigate()
  const [room, setRoom] = useState(null)
  const [currentPlayer, setCurrentPlayer] = useState(() => {
    // Initialize from localStorage
    const stored = localStorage.getItem('playerInfo')
    return stored ? JSON.parse(stored) : null
  });

  // Warning modal
  const [showAlert, setShowAlert] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');

  // Input theme modal
  const [showThemeModal, setShowThemeModal] = useState(false)
  const [hasSubmittedTheme, setHasSubmittedTheme] = useState(false);
  // Add a ref to track submission status that persists across re-renders
  const [submittedThemes, setSubmittedThemes] = useState(new Set());
  const [isProcessingThemes, setIsProcessingThemes] = useState(false)

  // Word selection modal
  const [showWordSelectionModal, setShowWordSelectionModal] = useState(false)
  const [hasSelectedWord, setHasSelectedWord] = useState(false)

  // Game end modal
  const [showEndGameModal, setShowEndGameModal] = useState(false)
  const [gameResult, setGameResult] = useState(null)

  // Error messages from emitted by front/back
  const [error, setError] = useState(null)

  useEffect(() => {
    // Get player info from localStorage
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'))

    if (!playerInfo) {
      window.alert('Error could not retrieve player info... Lost connection')
      return
    }

    const handleBeforeUnload = (e) => {
      // Cancel the event
      e.preventDefault();
      
      // Chrome requires returnValue to be set
      e.returnValue = '';

      if (currentPlayer && room?.accessCode) {
        socket.emit('leave-room', {
          accessCode: room.accessCode,
          username: currentPlayer.username
        });
      }
    };

    const handleRoomJoined = (roomData) => {
      setRoom(roomData);
      const player = roomData.players.find(p => p.username === playerInfo.username);
      setCurrentPlayer(player);
      localStorage.setItem('playerInfo', JSON.stringify({
        ...playerInfo,
        isHost: player.isHost
      }));
    }

    const handleKicked = (message) => {
      // const currentInfo = JSON.parse(localStorage.getItem('playerInfo'));
      // console.log('Kicked event received:', { playerInfo: currentInfo });

      socket.disconnect();
      localStorage.removeItem('playerInfo');
      setRoom(null);
      setCurrentPlayer(null);
      window.alert(message || 'You have been kicked from the room...');
      navigate('/join-create-game');
    }

    const handlePlayerKicked = ({ kickedPlayer, updatedRoom }) => {
      // console.log('Player kicked event received:', {
      //   kickedPlayer,
      //   currentRoom: room
      // });

      // Simply update the room with the new state
      setRoom(updatedRoom);
    }

    const handleRoomUpdated = (roomData) => {
      // console.log('Room Updated Event:', {
      //   gameState: roomData.gameState,
      //   themesCount: roomData.themes?.length,
      //   playersCount: roomData.players?.length,
      //   currentWord: roomData.currentSecretWord
      // });

      // Set new room data
      setRoom(roomData);

      // Find updated player data
      const updatedPlayer = roomData.players.find(p => p.username === playerInfo.username);

      // console.log('Player Update:', {
      //   currentRole: currentPlayer?.role,
      //   newRole: updatedPlayer?.role,
      //   username: updatedPlayer?.username,
      //   isRoleChanged: currentPlayer?.role !== updatedPlayer?.role
      // });

      // If player info exists and found updated data for player
      if (playerInfo?.username && updatedPlayer) {
        // Check for role change
        const isRoleChanged = currentPlayer?.role !== updatedPlayer.role
        
        // Update current player data
        setCurrentPlayer(prev => {
          // Only update if there are actual changes
          if (JSON.stringify(prev) !== JSON.stringify(updatedPlayer)) {
            return updatedPlayer;
          }
          return prev;
        });

        // Update localStorage only if necessary
        const storedInfo = JSON.parse(localStorage.getItem('playerInfo'));
        if (storedInfo.isHost !== updatedPlayer.isHost || storedInfo.role !== updatedPlayer.role) {
          localStorage.setItem('playerInfo', JSON.stringify({
            ...playerInfo,
            isHost: updatedPlayer.isHost,
            role: updatedPlayer.role
          }));
        }

        // Handle role change specific logic
        if (isRoleChanged) {
          // console.log(`Role changed from ${currentPlayer?.role} to ${updatedPlayer.role}`)

          if (updatedPlayer.role === 'drawer') {
            // Reset states for new drawer
            setHasSelectedWord(false)
          }
        }
      }
    }



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
      // console.log('Game state changed:', newState);
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

    const handleResetWordSelection = () => {
      setHasSelectedWord(false);
    }

    const handleGameEnded = ({ finalScores, result }) => {
      setGameResult(result);
      setShowEndGameModal(true);

      setHasSubmittedTheme(false);
      setSubmittedThemes(new Set());
      
      setRoom(prev => ({
        ...prev,
        gameState: GameRoomState.ENDING.name,
        players: finalScores
      }));
    }


    const handleError = (errorMessage) => {
      setError(errorMessage)
      localStorage.removeItem('playerInfo')
      window.alert(errorMessage)
      navigate('/join-create-game')
    }

    socket.on('connect', () => {
      console.log('Socket reconnected');
      // Re-join room if we have player info
      if (playerInfo && !socket.connected) {
        socket.emit('join-room', playerInfo.roomCode, playerInfo.username);
      }
    });

    socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      // Socket.IO will automatically try to reconnect
    });

    if (!socket.connected) {
      socket.connect();
    }

    window.addEventListener('beforeunload', handleBeforeUnload);

    // Emitting to join room

    // Socket event listeners
    socket.on('room-joined', handleRoomJoined);
    socket.on('room-updated', handleRoomUpdated);
    socket.on('host-changed', handleHostChanged);
    socket.on('player-left', handlePlayerLeft);
    socket.on('room-deleted', handleRoomDeleted)
    socket.on('game-state-changed', handleGameStateChanged);
    socket.on('kicked', handleKicked);
    socket.on('player-kicked', handlePlayerKicked);
    socket.on('reset-word-selection', handleResetWordSelection)
    socket.on('game-ended', handleGameEnded)
    socket.on('error', handleError);


    // Cleanup function
    return () => {
      // Unmount when disconnected
      if (currentPlayer && room?.accessCode) {
        socket.emit('leave-room', {
          accessCode: room.accessCode,
          username: currentPlayer.username
        });
      }

      window.removeEventListener('beforeunload', handleBeforeUnload);
      
      socket.off('connect')
      socket.off('disconnect')
      socket.off('room-joined');
      socket.off('room-updated');
      socket.off('host-changed');
      socket.off('player-left');
      socket.off('game-ended');
      socket.off('room-deleted');
      socket.off('game-state-changed');
      socket.off('timer-update');
      socket.off('kicked');
      socket.off('player-kicked');
      socket.off('reset-word-selection');
      socket.off('error');
      socket.disconnect();
    };
  }, [navigate]);

  useEffect(() => {
    // Reset alert when game state changes or when returning to waiting state
    if (room?.gameState !== GameRoomState.WAITING_FOR_HOST.name) {
      setShowAlert(false);
      setWarningMessage('');
    }
  }, [room?.gameState]);

  // Theme modal effect
  // useEffect(() => {
  //   if (room?.gameState === GameRoomState.CHOOSING_THEME.name) {
  //     const playerHasSubmitted = room.themes?.some(
  //       t => t.playerName === currentPlayer?.username
  //     );
      
  //     if (!playerHasSubmitted && !hasSubmittedTheme) {
  //       setShowThemeModal(true);
  //       setHasSubmittedTheme(false);
  //     } else {
  //       setShowThemeModal(false);
  //       setHasSubmittedTheme(true);
  //     }
  //   }
  // }, [room?.gameState, room?.themes, currentPlayer?.username, hasSubmittedTheme]);

  useEffect(() => {
    if (room?.gameState === GameRoomState.CHOOSING_THEME.name) {
      const playerHasSubmitted = room.themes?.some(
        t => t.playerName === currentPlayer?.username
      );
      
      // Only show modal if player hasn't submitted and we're not processing themes
      if (!playerHasSubmitted && !hasSubmittedTheme && !isProcessingThemes) {
        setShowThemeModal(true);
        setHasSubmittedTheme(false);
      } else {
        setShowThemeModal(false);
        setHasSubmittedTheme(true);
      }
    } else {
      // Reset states when leaving theme selection state
      setShowThemeModal(false);
      setIsProcessingThemes(false);
    }
  }, [room?.gameState, room?.themes, currentPlayer?.username, hasSubmittedTheme, isProcessingThemes]);

  // Word selection modal effect
  useEffect(() => {
    // console.log('Word Selection Modal State:', {
    //   gameState: room?.gameState,
    //   currentRole: currentPlayer?.role,
    //   hasSelectedWord,
    // });
  
    if (room?.gameState === GameRoomState.CHOOSING_WORD.name &&
        currentPlayer?.role === 'drawer' &&
        !hasSelectedWord) {
      setShowWordSelectionModal(true);
    } else {
      setShowWordSelectionModal(false);
      if (room?.gameState !== GameRoomState.CHOOSING_WORD.name) {
        setHasSelectedWord(false);
      }
    }
  }, [
    room?.gameState,
    currentPlayer?.role,
    hasSelectedWord
  ]);

  const handleThemeSubmit = async (theme) => {
    return new Promise((resolve, reject) => {
        // console.log('Submitting theme:', theme);
        socket.emit('submit-theme', {
            theme: theme.trim(),
            accessCode: room?.accessCode,
            playerName: currentPlayer?.username
        });

        // Listen for room update which indicates successful word generation
        const handleRoomUpdate = (updatedRoom) => {
            // Check if our theme was added
            const ourThemeSubmitted = updatedRoom.themes.some(
                t => t.playerName === currentPlayer?.username
            );
            
            if (ourThemeSubmitted) {
                socket.off('room-updated', handleRoomUpdate);
                socket.off('error', handleError);
                socket.off('game-state-changed', handleGameStateChange)
                setHasSubmittedTheme(true);
                setShowThemeModal(false);
                resolve();
            }
        };

        const handleGameStateChange = (newState) => {
          if (newState !== GameRoomState.CHOOSING_THEME.name) {
            socket.off('room-updated', handleRoomUpdate);
            socket.off('error', handleError);
            socket.off('game-state-changed', handleGameStateChange);
            setIsProcessingThemes(false);
            setShowThemeModal(false);
            resolve();
          }
        };
  

        // Listen for errors
        const handleError = (error) => {
          socket.off('room-updated', handleRoomUpdate);
          socket.off('error', handleError);
          socket.off('game-state-changed', handleGameStateChange);
          setIsProcessingThemes(false);
          reject(new Error(error));
        };

        // Add temporary listeners
        socket.on('room-updated', handleRoomUpdate);
        socket.on('error', handleError);
        socket.on('game-state-changed', handleGameStateChange);
    });
};

  const handleWordSelection = useCallback((selectedWord, wordChoices) => {
    if (!socket || !room?.accessCode || !currentPlayer?.role === "drawer") {
      console.error('Invalid word selection state');
      return;
    }

    socket.emit('select-word', {
      accessCode: room.accessCode,
      selectedWord,
      wordChoices,
    });

    setHasSelectedWord(true);
    setShowWordSelectionModal(false);
  }, [room?.accessCode, currentPlayer?.role]);


  // Handle what happens when player starts the game
  const handleStartGame = () => {
    // console.log('Playerinfo in handleStartGame', playerInfo)
    // console.log(room)
    if (currentPlayer?.isHost === "1") {
      if (room?.players?.length < 2) {
        setWarningMessage('At least 2 players are required to start the game')
        setShowAlert(true)
        return
      }
      socket.emit('start-game', { accessCode: room.accessCode });
    }
  };

  // Handle manual leave (e.g., when clicking a leave button)
  const handleLeaveGame = () => {
    try {
      //const playerInfo = JSON.parse(localStorage.getItem('playerInfo'));

      if (currentPlayer && room?.accessCode) {
        // socket.emit('user-disconnecting', {
        //   accessCode: playerInfo.roomCode,
        //   username: playerInfo.username,
        // })
        socket.emit('leave-room', {
          accessCode: room.accessCode,
          username: currentPlayer.username
        });
        localStorage.removeItem('playerInfo'); // Clear player info
        navigate('/join-create-game');
      } else {
        //console.error('Missing player info for leave game');
        window.alert('Missing player info for leave game')
        localStorage.removeItem('playerInfo');
        navigate('/join-create-game');
      }
    } catch (error) {
      console.error('Error leaving game:', error);
      localStorage.removeItem('playerInfo');
      navigate('/join-create-game'); // Navigate anyway in case of error
    }
  };

  // Player client states
  const isDrawer = currentPlayer?.role === "drawer";
  const isHost = currentPlayer?.isHost === "1";
  const canDraw = isDrawer && room?.gameState === GameRoomState.DRAWING.name;

  if (error) {
    <div className="flex h-screen items-center justify-center">
      <div className="text-center text-red-600">{error}</div>
    </div>;
  }


  // console.log('Game room state info: ', {
  //   isHost,
  //   currentPlayer,
  //   gameState: room?.gameState,
  //   roomData: room,
  // })

  return (
    <div className="w-full min-h-screen p-4 space-y-4">
      <WarningModal
        size="md"
        isOpen={showAlert}
        message={"At least 2 people must be in a game room for a game to start"}
        onClose={() => setShowAlert(false)}
      />

      <ThemeInputModal
        isOpen={showThemeModal}
        onSubmit={handleThemeSubmit}
        onClose={() => {
          if (
            room?.gameState !== GameRoomState.CHOOSING_THEME.name ||
            submittedThemes.has(currentPlayer?.username)
          ) {
            setShowThemeModal(false)
          }
        }}
        size="md"
      />

      <WordSelectionModal
        isOpen={showWordSelectionModal}
        size="lg"
        roomData={room}
        onWordSelect={handleWordSelection}
        onClose={() => {
          if (
            room?.gameState === GameRoomState.CHOOSING_WORD.name &&
            currentPlayer?.role === "guesser" &&
            !hasSelectedWord
          ) {
            return
          }
          setShowWordSelectionModal(false)
        }}
      />

      <GameEndModal
        isOpen={showEndGameModal}
        result={gameResult}
        onClose={() => {
          setShowEndGameModal(false)
          setGameResult(null)
        }}
      />

      <GameRoomHeader
        roomCode={room?.accessCode}
        isHost={isHost}
        onStartGame={handleStartGame}
        roundNumber={room?.roundNumber}
        gameState={room?.gameState}
        onLeaveGame={handleLeaveGame}
        currentWord={room?.currentSecretWord}
        isDrawer={currentPlayer?.role === "drawer"}
      />

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4">
        <div className="md:col-span-1">
          <GameRoomPlayers
            currentPlayer={currentPlayer}
            roomCode={room?.accessCode}
            players={room?.players || []}
            currentDrawerUsername={
              room?.players?.find((p) => p.role === "drawer")?.username
            }
          />
        </div>
        <div className="md:col-span-2 lg:col-span-2">
          <GameRoomCanvas isDrawing={canDraw} roomCode={room?.accessCode} />
        </div>
        <div className="md:col-span-3 lg:col-span-1">
          <GameRoomChat
            roomCode={room?.accessCode}
            playerName={currentPlayer?.username}
            isDrawing={isDrawer}
            currentWord={room?.currentSecretWord}
            gameState={room?.gameState}
          />
        </div>
      </div>
    </div>
  );
};

export default GameRoom;