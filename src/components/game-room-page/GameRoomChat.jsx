import { useState, useEffect, useRef} from "react";
import { Button, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import socket from '../../utils/socket'

const GameRoomChat = ({ roomCode, playerName, isDrawing, currentWord, gameState }) => {
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState('');
  const [wordChoices, setWordChoices] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
      const handleChatMessage = (message) => {
          setMessages(prev => [...prev, message]);
      };

      const handleWordChoices = (words) => {
          setWordChoices(words);
      };

      socket.on('chat-message', handleChatMessage);
      socket.on('word-choices', handleWordChoices);

      return () => {
          socket.off('chat-message');
          socket.off('word-choices');
      };
  }, []);

  useEffect(() => {
    // Scroll to the bottom whenever messages change
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const sendMessage = () => {
      if (!message.trim()) return;
    //   if (gameState === 'DRAWING') {
    //       if (isDrawing) {
    //           socket.emit('chat-message', {
    //               roomCode,
    //               username: playerName,
    //               content: message,
    //               type: 'chat'
    //           });
    //       } else {
    //           socket.emit('guess-word', {
    //               roomCode,
    //               username: playerName,
    //               guess: message
    //           });
    //       }
    //   } else {
    //       socket.emit('chat-message', {
    //           roomCode,
    //           username: playerName,
    //           content: message,
    //           type: 'chat'
    //       });
    //   }
      socket.emit('chat-message',{
        roomCode,
        username:playerName,
        content:message,
        type:'chat'
      })

      setMessage('');
  };

  // Word selection UI
  if (gameState === 'CHOOSING_WORD' && isDrawing && wordChoices.length > 0) {
      return (
          <Card className="w-80">
              <CardHeader className="font-bold">Choose a Word</CardHeader>
              <Divider />
              <CardBody>
                  <div className="flex flex-col gap-2">
                      {wordChoices.map((word, index) => (
                          <Button 
                              key={index}
                              color="primary"
                              onClick={() => {
                                  socket.emit('word-selected', {
                                      roomCode,
                                      word
                                  });
                                  setWordChoices([]);
                              }}
                          >
                              {word}
                          </Button>
                      ))}
                  </div>
              </CardBody>
          </Card>
      );
  }

  // Regular chat UI
  return (
    <Card className="w-full max-w-sm mt-2 shadow-lg bg-divider-500 rounded-xl border border-black p-4">
      <CardHeader className="text-2xl font-bold text-center text-white">Chat</CardHeader>
      <Divider />
      <CardBody>
        <div className="flex flex-col h-[500px]">
          <div className="flex-1 overflow-y-auto mb-4 space-y-2 text-white">
            {messages.map((msg, index) => (
              <div key={index} className="text-sm">
                <span className="font-semibold">{msg.username}:</span> {msg.content}
              </div> 
            ))}
            <div ref={messagesEndRef} /> {/* Scroll-to-bottom reference */}
          </div>
          <div className="flex gap-2 py-3">
            <Input 
              type="text"
              placeholder="Type a message..."
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              onKeyPress={(event) => {
                if (event.key === 'Enter') {
                  sendMessage();
                }
              }}
            />
          </div>
          <Button 
            className="flex-l rounded-md"
            color="primary" 
            size="sm" 
            onClick={sendMessage}
          >
            Send
          </Button>
        </div>
      </CardBody>
    </Card>
  );
};

export default GameRoomChat;