import { useState } from 'react'
import { Button } from '@nextui-org/react'
import Header from './components/Header.jsx'
import CanvasComponent from './CanvasComponent'
import InfoComponent from './InfoComponent'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import EditProfile from './EditProfile.jsx'
// import EmailVerificationHandler from './EmailVerificationHandler.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'

const App = () => {
	return (
		<BrowserRouter>
			<Header/>
			<main>			
				<Routes>
					{/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
					<Route path="/" element={<SignUp/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/signup" element={<SignUp/>}/>
					<Route path="/edit-profile" element={<EditProfile/>}/>
				</Routes>
			</main>
		</BrowserRouter>
	)
}
  
export default App

/*{ <CanvasComponent color={color} brushSize={brushSize} />
<Button id="change_to_white" onClick={() => setColor('white')}>White</Button>
<Button id="change_to_black" onClick={() => setColor('black')}>Black</Button>
<Button id="small_brush" onClick={() => setBrushSize(1)}>Small</Button>
<Button id="medium_brush" onClick={() => setBrushSize(5)}>Medium</Button>
<Button id="large_brush" onClick={() => setBrushSize(10)}>Large</Button> }*/

