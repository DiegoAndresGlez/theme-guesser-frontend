import React, { useRef, useEffect, useState } from 'react';
import { Card, Button } from "@nextui-org/react";
import socket from '../../utils/socket';
import { GameRoomState } from '../../utils/GameRoomState';

const GameRoomCanvas = ({ color, brushSize, isDrawing, roomCode, gameState }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const aspectRatio = 3 / 2; // Set a default aspect ratio, e.g., 3:2 or 4:3
  const lastPos = useRef(null)

  useEffect(() => {
    // Function to set initial and responsive canvas size
    const setInitialSize = () => {
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Set the canvas width as 80% of the viewport width, but not larger than 800px
      const width = Math.min(viewportWidth * 0.8, 800);
      const height = width / aspectRatio;

      setCanvasSize({ width, height });
    };

    setInitialSize(); // Set size on initial load
    window.addEventListener('resize', setInitialSize); // Update on resize

    return () => window.removeEventListener('resize', setInitialSize);
  }, []);

  useEffect(() => {
    if (!canvasRef.current)
      return

    // Handle drawing data
    const handleDraw = (drawData) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(drawData.start.x, drawData.start.y);
      ctx.lineTo(drawData.end.x, drawData.end.y);
      ctx.strokeStyle = drawData.color;
      ctx.lineWidth = drawData.brushSize;
      ctx.stroke();
    }

    // Handle canvas clear command
    const handleClear = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
    }

    socket.on('draw-line', handleDraw);
    socket.on('clear-canvas', handleClear);

    return () => {
      socket.off('draw-line');
      socket.off('clear-canvas');
    }

  }, [canvasSize.width, canvasSize.height]);

  useEffect(() => {
    if (!canvasRef.current) return;

    // Request canvas state when joining
    if (!isDrawing) {
      socket.emit('request-canvas-state', { roomCode });
    }

    // Handle request for canvas state (only drawer responds)
    const handleCanvasStateRequest = () => {
      if (isDrawing && canvasRef.current) {
        const canvasData = canvasRef.current.toDataURL();
        socket.emit('send-canvas-state', {
          roomCode,
          canvasData
        });
      }
    };

    // Handle receiving canvas state
    const handleReceiveCanvasState = ({ canvasData }) => {
      if (!isDrawing && canvasRef.current) {
        const img = new Image();
        img.onload = () => {
          const ctx = canvasRef.current.getContext('2d');
          ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
          ctx.drawImage(img, 0, 0);
        };
        img.src = canvasData;
      }
    };

    socket.on('get-canvas-state', handleCanvasStateRequest);
    socket.on('receive-canvas-state', handleReceiveCanvasState);

    return () => {
      socket.off('get-canvas-state');
      socket.off('receive-canvas-state');
    };
  }, [isDrawing, roomCode, canvasSize.width, canvasSize.height]);

  const startDrawing = (event) => {
    if (!isDrawing) return

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);

    lastPos.current = { x, y };
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing || !isDrawing || !lastPos.current) return;

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(lastPos.current.x, lastPos.current.y);
    ctx.lineTo(x, y);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();

    // Emit drawing data to other players
    socket.emit('draw-line', {
      roomCode,
      start: lastPos.current,
      end: { x, y },
      color,
      brushSize,
    });

    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    setDrawing(false);
    lastPos.current = null;
  };

  const clearCanvas = () => {
    if(!isDrawing) return;

    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);

    socket.emit('clear-canvas', { roomCode });
  };

  const touchDrawStart = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    startDrawing({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  const touchDraw = (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    draw({
      clientX: touch.clientX,
      clientY: touch.clientY
    });
  };

  return (
    <Card className="bg-white border-2 flex border-gray-300 rounded-lg items-center justify-center">
      <canvas
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          width: `${canvasSize.width}px`,
          height: `${canvasSize.height}px`,
          cursor: isDrawing ? 'crosshair' : 'default'
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
        onTouchStart={touchDrawStart}
        onTouchMove={touchDraw}
        onTouchEnd={stopDrawing}
      />
      {isDrawing && (
        <Button
          onClick={clearCanvas}
          className="m-2"
          color="secondary"
        >
          Clear Canvas
        </Button>
      )}
    </Card>
  );
};

export default GameRoomCanvas;
