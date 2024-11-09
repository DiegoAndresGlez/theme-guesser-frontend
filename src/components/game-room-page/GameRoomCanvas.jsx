import React, { useRef, useEffect, useState } from 'react';
import { Card, Button } from "@nextui-org/react";

const GameRoomCanvas = ({ color, brushSize }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const aspectRatio = 3 / 2; // Set a default aspect ratio, e.g., 3:2 or 4:3

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

  const startDrawing = (event) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    setDrawing(true);
  };

  const draw = (event) => {
    if (!drawing) return;
    const ctx = canvasRef.current.getContext('2d');
    ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
    ctx.strokeStyle = color;
    ctx.lineWidth = brushSize;
    ctx.stroke();
  };

  const stopDrawing = () => {
    setDrawing(false);
  };

  const clearCanvas = () => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
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
        }}
        onMouseDown={startDrawing}
        onMouseMove={draw}
        onMouseUp={stopDrawing}
        onMouseLeave={stopDrawing}
      />
      <Button onClick={clearCanvas}>Clear</Button>
    </Card>
  );
};

export default GameRoomCanvas;
