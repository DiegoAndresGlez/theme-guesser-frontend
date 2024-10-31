import NavBar from './components/NavBar.jsx'
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import EditProfile from './EditProfile.jsx'
// import EmailVerificationHandler from './EmailVerificationHandler.jsx'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import ForgotPasswordConfirm from './ForgotPasswordConfirm.jsx'
import ForgotPasswordEmail from './ForgotPasswordEmail.jsx'
import JoinCreateGame from './JoinCreateGame.jsx'

const App = () => {
	return (
		<BrowserRouter>
			<div className="bg-[url('./assets/img/background_drawing.png')] relative bg-repeat bg-[length:50rem] bg-left min-h-screen">
			<NavBar/>
			<main>			
				<Routes>
					{/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
					<Route path="/" element={<Login/>}/>
					<Route path="/login" element={<Login/>}/>
					<Route path="/signup" element={<SignUp/>}/>
					<Route path="/edit-profile/:id" element={<EditProfile/>}/>
					<Route path="/forgot-password" element={<ForgotPasswordEmail/>}/>
					<Route path="/forgot-password-confirm" element={<ForgotPasswordConfirm/>}/>
					<Route path="/join-create-game" element={<JoinCreateGame/>}/>
				</Routes>
			</main>
			</div>
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

