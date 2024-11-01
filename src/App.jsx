import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'

/* Components */
import Navbar from './components/NavBar.jsx'

/* Pages */
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import EditProfile from './EditProfile.jsx'
// import EmailVerificationHandler from './EmailVerificationHandler.jsx'
import ForgotPasswordConfirm from './ForgotPasswordConfirm.jsx'
import ForgotPasswordEmail from './ForgotPasswordEmail.jsx'
import JoinCreateGame from './JoinCreateGame.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';

const App = () => {
  const [isProfileDisabled, setIsProfileDisabled] = useState(true)

	useEffect(() => {
		document.title = "Theme Guesser"
	}, [])

  // useEffect(() => {
  //   const checkUserSession = async () => {
  //       const { data, error } = await supabase.auth.getSession();
  //       if (error) {
  //           console.error('Error fetching user:', error.message);
  //           setIsProfileDisabled(true);
  //           return;
  //       }
  //       setIsProfileDisabled(!data.session?.user)
  //   };

  //   checkUserSession();

  //   // Correct subscription syntax
  //   const { data: { subscription }, } = supabase.auth.onAuthStateChange((_, session) => {
  //       setIsProfileDisabled(!session?.user);
  //   });

  //   // Clean up subscription
  //   return () => {
  //       if (subscription) subscription.unsubscribe();
  //   };
  // }, []);

	return (
    <BrowserRouter>
      <div className="backgroundImage">
        <Navbar isProfileDisabled={isProfileDisabled} />
        <main className='main-content'>
          <Routes>
            {/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/forgot-password" element={
              <ProtectedRoute>
                <ForgotPasswordEmail />
              </ProtectedRoute>
            } />
            <Route
              path="/forgot-password-confirm"
              element={<ForgotPasswordConfirm />}
            />
            <Route path="/join-create-game" element={<JoinCreateGame />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
  
export default App

/*{ <CanvasComponent color={color} brushSize={brushSize} />
<Button id="change_to_white" onClick={() => setColor('white')}>White</Button>
<Button id="change_to_black" onClick={() => setColor('black')}>Black</Button>
<Button id="small_brush" onClick={() => setBrushSize(1)}>Small</Button>
<Button id="medium_brush" onClick={() => setBrushSize(5)}>Medium</Button>
<Button id="large_brush" onClick={() => setBrushSize(10)}>Large</Button> }*/

