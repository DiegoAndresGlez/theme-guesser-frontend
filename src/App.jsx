import Header from './components/Header.jsx'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import EditProfile from './EditProfile.jsx'
// import EmailVerificationHandler from './EmailVerificationHandler.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ForgotPassword from './ForgotPassword.jsx'
import JoinCreateGame from './JoinCreateGame.jsx'

const App = () => {
	return (
		<BrowserRouter>
			<Header/>
			<main>			
				<Routes>
					{/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
					<Route path="/" element={<Login/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/signup" element={<SignUp/>}/>
					<Route path="/edit-profile" element={<EditProfile/>}/>
					<Route path="/forgot-password" element={<ForgotPassword/>}/>
					<Route path="/join-create-game" element={<JoinCreateGame/>}/>
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

