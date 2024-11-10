import { useState, useEffect, useRef } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import socket from '../../utils/socket'
import { useNavigate } from 'react-router-dom';

const GameRoomHeader = () => {
    const [ roomCodeUI, setRoomCodeUI ] = useState("")
    const playerInfo = JSON.parse(localStorage.getItem('playerInfo'))
    const navigate = useNavigate()

    useEffect(() => {
      if (!playerInfo) {
        console.error('Game Room Header, no player info...')
        navigate('/join-create-game')
        return
      }
      setRoomCodeUI(playerInfo.roomCode)
    }, [])

    return (
        <>
        <h1 className="text-2xl font-bold">Theme Guesser</h1>

        <div className="flex gap-4 mb-4">
          <Button className="w-80 h-20">START</Button>
          {/* <Card className="w-80">
                </Card> */}
  
          {/* Second Header Card */}
          <Card className="flex-1">
            <CardBody>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-2xl text-gray-500">Room Code: #{roomCodeUI}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Round</p>
                    <p className="text-lg font-semibold">2/5</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-lg font-semibold">60s</p>
                  </div>
                  <Button color="primary" size="sm">
                    Leave Game
                  </Button>
                </div>
              </div>
            </CardBody>
          </Card>
        </div>
        </>
    )
}

export default GameRoomHeader