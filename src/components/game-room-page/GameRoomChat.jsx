import { useState, useEffect, useRef} from "react";
import { Button, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import socket from '../../utils/socket'

const GameRoomChat = ({ roomCode, playerName, isDrawing, currentWord, gameState }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
      const handleChatMessage = (message) => {
          setMessages(prev => [...prev, message]);
      };

      const handleCorrectGuess = ({ guesser, guesserScore, drawerScore, drawer }) => {
        setMessages(prev => [
          ...prev,
          {
            content: `${guesser} earned ${guesserScore} points!`,
            type: 'system'
          },
          {
            content: `${drawer} earned ${drawerScore} points for drawing!`,
            type: 'system'
          }
        ]);
      };

      const handlePlayerGuessed = ({ username }) => {
        setMessages(prev => [
          ...prev,
          {
            content: `${username} made a guess!`,
            type: 'system'
          }
        ]);
      };

      socket.on('chat-message', handleChatMessage);
      socket.on('correct-guess', handleCorrectGuess);
      socket.on('player-guessed', handlePlayerGuessed);

      return () => {
          socket.off('chat-message');
          socket.off('correct-guess');
          socket.off('player-guessed');
      };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
    if (!message.trim()) return;

    // If in drawing phase and not the drawer, treat as guess
    if (gameState === 'DRAWING' && !isDrawing) {
      socket.emit('guess-word', {
        accessCode: roomCode,
        guess: message,
        username: playerName
      });
    }
    if (currentWord !== message) {
      socket.emit('chat-message', {
        roomCode,
        username: playerName,
        content: message,
        type: 'chat'
      });
    }
    setMessage('');
  };

  // Get input placeholder text
  const getPlaceholderText = () => {
    if (gameState === 'DRAWING') {
      if (isDrawing) {
        return "Chat disabled while drawing";
      }
      return "Type your guess...";
    }
    return "Type a message...";
  };

  return (
    <Card className="w-full max-w-sm mt-2 shadow-lg bg-divider-500 rounded-xl border border-black p-4">
      <CardHeader className="text-2xl font-bold text-center text-white">Chat</CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`text-sm ${msg.type === 'system' ? 'text-white-500 bold' : ''}`}
              >
                {msg.type === 'system' ? (
                  msg.content
                ) : (
                  <>
                    <span className="font-semibold">{msg.username}:</span> {msg.content}
                  </>
                )}
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="flex gap-2 py-3">
            <Input
              type="text"
              placeholder={getPlaceholderText()}
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter' && (!isDrawing || gameState !== 'DRAWING')) {
                  sendMessage();
                }
              }}
              isDisabled={gameState === 'DRAWING' && isDrawing}
            />
          </div>
          <Button
            className="flex-l rounded-md"
            color="primary"
            size="sm"
            onClick={sendMessage}
            isDisabled={gameState === 'DRAWING' && isDrawing}
          >
            {gameState === 'DRAWING' && !isDrawing ? 'Guess' : 'Send'}
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default GameRoomChat;