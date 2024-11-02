import { useRef, useState } from 'react'
import { Card, Button } from "@nextui-org/react"
import propTypes from 'prop-types';

const CanvasComponent = ({ color, brushSize }) => {
    const canvasRef = useRef(null);
    const [drawing, setDrawing] = useState(false);
  
    const startDrawing = (event) => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.beginPath();
      ctx.moveTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      setDrawing(true);
    }
  
    const draw = (event) => {
      if (!drawing) 
        return;
      const ctx = canvasRef.current.getContext('2d');
      ctx.lineTo(event.nativeEvent.offsetX, event.nativeEvent.offsetY);
      ctx.strokeStyle = color;
      ctx.lineWidth = brushSize;
      ctx.stroke();
    }
  
    const stopDrawing = () => {
      setDrawing(false);
    }
  
    const clearCanvas = () => {
      const ctx = canvasRef.current.getContext('2d');
      ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }

    return (
        <Card css={{ padding: '1rem' }}>
            <canvas
            ref={canvasRef}
            width={600}
            height={400}
            style={{ border: '1px solid black' }}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            />
            <Button onClick={clearCanvas}>Clear</Button>
        </Card>
    )
}

CanvasComponent.propTypes = {
	color: propTypes.string.isRequired, // color should be a required string
	brushSize: propTypes.number.isRequired, // brushSize should be a required number
}

export default CanvasComponent