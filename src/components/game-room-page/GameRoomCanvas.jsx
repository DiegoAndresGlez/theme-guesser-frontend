import { useRef, useEffect, useState, useCallback } from 'react';
import { Card, Button, Divider } from "@nextui-org/react";
import { HexColorPicker } from 'react-colorful';
import socket from '../../utils/socket';

const GameRoomCanvas = ({ isDrawing, roomCode }) => {
  const canvasRef = useRef(null);
  const [drawing, setDrawing] = useState(false);
  const [canvasSize, setCanvasSize] = useState({ width: 600, height: 400 });
  const [color, setColor] = useState('#000000');
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [brushSize, setBrushSize] = useState(5);
  const [isEraser, setIsEraser] = useState(false);

  // History management 
  const [canvasStates, setCanvasStates] = useState([]);
  const [currentStateIndex, setCurrentStateIndex] = useState(-1);
  const isDrawingRef = useRef(false);

  const aspectRatio = 3 / 2; // Set a default aspect ratio, e.g., 3:2 or 4:3
  const brushSizes = [5, 10, 15];
  const lastPos = useRef(null);

  const setCanvasSizeWithContent = useCallback(() => {
    if (!canvasRef.current) return;

    const viewportWidth = window.innerWidth;
    
    // Set the canvas width as 80% of the viewport width, but not larger than 800px
    const width = Math.min(viewportWidth * 0.8, 800);
    const height = width / aspectRatio;

    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvasRef.current.width;
    tempCanvas.height = canvasRef.current.height;
    const tempCtx = tempCanvas.getContext('2d');
    tempCtx?.drawImage(canvasRef.current, 0, 0);

    setCanvasSize({ width, height });

    // Use requestAnimationFrame to ensure the canvas size is updated before redrawing
    requestAnimationFrame(() => {
      if (!canvasRef.current) return;
      const ctx = canvasRef.current.getContext('2d');
      if (!ctx) return;

      ctx.drawImage(
        tempCanvas,
        0, 0, tempCanvas.width, tempCanvas.height,
        0, 0, width, height
      );
    });
  }, [aspectRatio]);

  useEffect(() => {
    setCanvasSizeWithContent();
    window.addEventListener('resize', setCanvasSizeWithContent);

    return () => window.removeEventListener('resize', setCanvasSizeWithContent);
  }, [setCanvasSizeWithContent]);

  useEffect(() => {
    if (!canvasRef.current)
      return

    // Handle drawing data
    const handleDraw = (drawData) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(drawData.start.x, drawData.start.y);
      ctx.lineTo(drawData.end.x, drawData.end.y);

      // Set composite operation based on received data
      ctx.globalCompositeOperation = drawData.color === 'eraser' ? 'destination-out' : 'source-over';

      ctx.strokeStyle = drawData.color === 'eraser' ? 'rgba(0,0,0,1)' : drawData.color;
      ctx.lineWidth = drawData.brushSize;
      ctx.stroke();

      // Reset composite operation
      ctx.globalCompositeOperation = 'source-over';
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

  // Save current canvas state to undo stack
  const saveState = () => {
    if (!canvasRef.current || !isDrawing) return;
    
    const state = canvasRef.current.toDataURL();
    
    setCanvasStates(prevStates => {
      const newStates = [...prevStates.slice(0, currentStateIndex + 1), state];
      return newStates;
    });
    
    const newIndex = currentStateIndex + 1
    setCurrentStateIndex(newIndex);

    socket.emit('canvas-history-update', {
      roomCode,
      canvasDate: state,
      actionType: 'new-state',
      stateIndex: newIndex,
    })
  };

  useEffect(() => {
    if (!canvasRef.current) return;

    // Handle history updates from other clients
    const handleHistoryUpdate = ({ canvasData, actionType, stateIndex }) => {
      if (isDrawing) return; // Don't process updates if you're the drawer

      const img = new Image();
      img.onload = () => {
        const ctx = canvasRef.current.getContext('2d');
        ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
        ctx.drawImage(img, 0, 0);

        // Update local state based on action type
        if (actionType === 'new-state') {
          setCanvasStates(prev => [...prev.slice(0, stateIndex), canvasData]);
        }
        setCurrentStateIndex(stateIndex);
      };
      img.src = canvasData;
    };

    socket.on('canvas-history-update', handleHistoryUpdate);

    return () => {
      socket.off('canvas-history-update');
    };
  }, [canvasSize.width, canvasSize.height, isDrawing]);

  // Handle undo action
  const handleUndo = () => {
    if (currentStateIndex <= 0 || !canvasRef.current) return;

    const newIndex = currentStateIndex - 1;
    setCurrentStateIndex(newIndex);

    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.drawImage(img, 0, 0);

      // Emit the canvas state to other players
      socket.emit('canvas-history-update', {
        roomCode,
        canvasData: canvasStates[newIndex],
        actionType: 'undo',
        stateIndex: newIndex,
      })
    };
    img.src = canvasStates[newIndex];
  };

  // Handle redo action
  const handleRedo = () => {
    if (currentStateIndex >= canvasStates.length - 1 || !canvasRef.current) return;

    const newIndex = currentStateIndex + 1;
    setCurrentStateIndex(newIndex);

    const img = new Image();
    img.onload = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasSize.width, canvasSize.height);
      ctx.drawImage(img, 0, 0);

      // Emit the canvas state to other players
      socket.emit('canvas-history-update', {
        roomCode,
        canvasData: canvasStates[newIndex],
        actionType: 'redo',
        stateIndex: newIndex,
      })
    };
    img.src = canvasStates[newIndex];
  };

  // Initialize canvas state
  useEffect(() => {
    if (canvasRef.current) {
      const initialState = canvasRef.current.toDataURL();
      setCanvasStates([initialState]);
      setCurrentStateIndex(0);
    }
  }, []);

  const startDrawing = (event) => {
    if (!isDrawing) return

    const rect = canvasRef.current.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    const ctx = canvasRef.current.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(x, y);

    // Set composite operation based on mode
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';

    lastPos.current = { x, y };
    setDrawing(true);
    isDrawingRef.current = true;
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

    // Set composite operation based on mode
    ctx.globalCompositeOperation = isEraser ? 'destination-out' : 'source-over';
    ctx.strokeStyle = isEraser ? 'rgba(0,0,0,1)' : color;
    ctx.lineWidth = brushSize;
    ctx.stroke();

    // Emit drawing data to other players
    socket.emit('draw-line', {
      roomCode,
      start: lastPos.current,
      end: { x, y },
      color: isEraser ? 'eraser' : color,
      brushSize,
    });

    lastPos.current = { x, y };
  };

  const stopDrawing = () => {
    if (isDrawingRef.current) {
      saveState();
      isDrawingRef.current = false;
    }
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
    <Card className="bg-white border-2 border-gray-300 rounded-lg flex flex-col">
      {/* Canvas Container */}
      <div className="flex items-center justify-center p-4">
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
      </div>

      {/* Toolbar */}
      {isDrawing && (
        <>
          <Divider />
          <div className="flex items-center justify-between p-4 relative">
            <div className="flex items-center gap-4">
              {/* Color Picker */}
              <div className="color-picker-container relative">
                <button
                  onClick={() => {
                    setShowColorPicker(!showColorPicker);
                    setIsEraser(false);
                  }}
                  className="w-8 h-8 rounded border border-gray-300"
                  style={{ backgroundColor: color }}
                  title="Choose Color"
                />
                {showColorPicker && (
                  <div className="absolute bottom-full left-0 mb-2 shadow-lg rounded-lg overflow-hidden z-50">
                    <HexColorPicker color={color} onChange={setColor} />
                  </div>
                )}
              </div>

              {/* Eraser Button */}
              <Button
                onClick={() => setIsEraser(!isEraser)}
                size="sm"
                variant={isEraser ? "solid" : "flat"}
                color="secondary"
                title="Eraser"
              >
                Eraser
              </Button>

              {/* Brush Size Buttons */}
              <div className="flex items-center gap-2">
                {brushSizes.map((size) => (
                  <Button
                    key={size}
                    onClick={() => setBrushSize(size)}
                    size="sm"
                    color="secondary"
                    variant={brushSize === size ? "solid" : "flat"}
                    className="relative group"
                    title={`${size}px brush`}
                  >
                    <div className="flex items-center justify-center w-full h-full">
                      <div
                        className="rounded-full"
                        style={{
                          width: `${Math.min(size, 15)}px`,
                          height: `${Math.min(size, 15)}px`,
                          backgroundColor: brushSize === size ? "white" : "black"
                        }}
                      />
                    </div>
                  </Button>
                ))}

              </div>

              <div className='flex items-center gap-2'>
                {/* Undo Redo Buttons */}
                <Button
                  onClick={handleUndo}
                  size="sm"
                  variant="flat"
                  isDisabled={currentStateIndex <= 0}
                  title="Undo"
                >
                  Undo
                </Button>
                <Button
                  onClick={handleRedo}
                  size="sm"
                  variant="flat"
                  isDisabled={currentStateIndex >= canvasStates.length - 1}
                  title="Redo"
                >
                  Redo
                </Button>
              </div>
            </div>

            {/* Clear Canvas Button */}
            <Button
              onClick={clearCanvas}
              className="ml-4"
              color="danger"
              size="sm"
              radius="full"
            >
              Clear Canvas
            </Button>
          </div>
        </>
      )}
    </Card>
  );
};

export default GameRoomCanvas;
