import { useState, useEffect, useRef } from 'react';
import { Card, CardBody } from "@nextui-org/react";
import { Button } from "@nextui-org/react";
import socket from '../../utils/socket'
import { useNavigate } from 'react-router-dom';


const GameRoomHeader = ({
  roomCode,
  timeLeft,
  isHost,
  onStartGame,
  roundNumber,
  gameState,
  onLeaveGame // Add this prop
}) => {

    return (
        <>
        <h1 className="text-2xl font-bold">{}</h1>

        <div className="flex gap-4 mb-4">
          {isHost && gameState === 'WAITING_FOR_HOST' && (
            <Button onClick={onStartGame} className="w-80 h-20">START</Button>
          )}
  
          {/* Second Header Card */}
          <Card className="flex-1">
            <CardBody>
              <div className="flex justify-between items-center">
                <div className="space-y-1">
                  <p className="text-2xl text-gray-500">Room Code: #{roomCode}</p>
                </div>
                <div className="flex gap-4 items-center">
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Round</p>
                    <p className="text-lg font-semibold">{roundNumber}/3</p>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-500">Time Left</p>
                    <p className="text-lg font-semibold">{timeLeft}</p>
                  </div>
                  <Button onClick={onLeaveGame} color="primary" size="sm">
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