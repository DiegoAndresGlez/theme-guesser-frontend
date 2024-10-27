import { useState } from 'react'
import { Button } from '@nextui-org/react'
import CanvasComponent from './CanvasComponent'
import InfoComponent from './InfoComponent'
import LoginPage from './LoginPage'
import SignUpPage from './SignUpPage.jsx'

const App = () => {
	const [color, setColor] = useState('black');
	const [brushSize, setBrushSize] = useState(10);

	return (
		<>
			<LoginPage/>
			{/* <SignUpPage/> */}
			{/* <CanvasComponent color={color} brushSize={brushSize} />
			<Button id="change_to_white" onClick={() => setColor('white')}>White</Button>
			<Button id="change_to_black" onClick={() => setColor('black')}>Black</Button>
			<Button id="small_brush" onClick={() => setBrushSize(1)}>Small</Button>
			<Button id="medium_brush" onClick={() => setBrushSize(5)}>Medium</Button>
			<Button id="large_brush" onClick={() => setBrushSize(10)}>Large</Button> */}
		</>
	)
}
  
export default App

