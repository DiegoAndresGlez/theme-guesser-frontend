import { useState, useEffect } from "react";
import { Button, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import socket from '../../utils/socket'

const GameRoomChat = ({ accessCode, playerId, isDrawer }) => {
    const [message, setMessage] = useState('');
    const [messageReceived, setMessageReceived] = useState("")
  
    const sendMessage = (e) => {
      e.preventDefault()
      socket.emit("send_message", { message: message })
    }

    useEffect(() => {
      console.log('Socket in GameRoomChat:', socket)

      // Subscribe to socket events
      socket.on('receive_message', (data) => {
        setMessageReceived(data.message)
      });
  
      // Cleanup on unmount
      // return () => {
      //   socket.off('receive_message');
      // };
    }, [socket]);
  
    const handleSubmit = (e) => {
      e.preventDefault();
      // if (!message.trim() || !socket) return;

      // if (isDrawer) {
      //   socket.emit('chatMessage', {
      //     accessCode,
      //     playerId,
      //     message,
      //     type: 'chat'
      //   });
      // } else {
      //   socket.emit('makeGuess', {
      //     accessCode,
      //     playerId,
      //     guess: message
      //   });
      // }
      setMessage('');
    };

    return(
        <Card className="w-80">
          <CardHeader className="font-bold">Chat</CardHeader>
          <Divider />
          <CardBody>
            <div className="flex flex-col h-[500px]">
              <div className="flex-1 overflow-y-auto mb-4 space-y-2">
                <div className="text-sm">
                  <span className="font-semibold">Player 1:</span> {messageReceived}
                </div>
                <div className="text-sm">
                  <span className="font-semibold">Player 2:</span> Looks like a
                  cat!
                </div>
                <div className="text-sm text-blue-500">
                  Player 3 is getting closer!
                </div>
              </div>
              <div className="flex gap-2 py-3">
                <Input type="text" placeholder="Type your guess..." onChange={(event) => {
                  setMessage(event.target.value)
                }}/>
              </div>
              <Button className="flex-l" color="primary" size="sm" onClick={sendMessage}>
                Send
              </Button>
            </div>
          </CardBody>
        </Card>
    )
  }

export default GameRoomChat