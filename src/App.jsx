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
import supabase from './config/supabaseClient.js'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")

	useEffect(() => {
    document.title = "Theme Guesser";
  }, []);

  useEffect(() => {
    // Function to check the initial authentication status
    const checkAuth = async () => {
      const { data } = await supabase.auth.getSession();

      if (data) {
        const response = await fetch(`http://localhost:3000/api/auth/user-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${data.session.access_token}`
          },
        });

        if(!response.ok){
          throw new Error("Error fetching user profile resource.")
        }

        const responseData = await response.json();
        setUsername(responseData.username)
      }

      setIsAuthenticated(!!data.session?.user);
    };

    // Check initial authentication status
    checkAuth();

    // Set up a listener for authentication state changes
    const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session?.user);
    });

    // Cleanup the listener on component unmount
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

	return (
    <BrowserRouter>
      <div className="backgroundImage">
        { isAuthenticated ? (<Navbar isProfileDisabled={false} username={username}/>) : (<Navbar isProfileDisabled={true} username={username}/>)}
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

