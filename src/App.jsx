import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { useEffect, useState } from 'react'
import supabase from './config/supabaseClient.js'

/* Components */
import Navbar from './components/NavBar.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx';
import ConfirmSignUp from './components/ConfirmSignup.jsx'

/* Pages */
import Login from './Login.jsx'
import SignUp from './SignUp.jsx'
import EditProfile from './EditProfile.jsx'
// import EmailVerificationHandler from './EmailVerificationHandler.jsx'
import ResetPassword from './ResetPassword.jsx'
import ForgotPassword from './ForgotPassword.jsx'
import JoinCreateGame from './JoinCreateGame.jsx'
import GameRoom from './GameRoom.jsx'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
    document.title = "Untitled - A Draw and Guess Game";
  }, []);


  useEffect(() => {
    // Function to handle auth state
    const handleAuthChange = async (event, session) => {
      setIsLoading(true);
      try {
        if (session?.user) {
          setIsAuthenticated(true);
          await fetchUserProfile(session.access_token);
        } else {
          setIsAuthenticated(false);
          setUsername("");
        }
      } catch (error) {
        console.error('Auth change error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Check initial auth state
    const initializeAuth = async () => {
      try {
        const { data } = await supabase.auth.getSession();
        if (data.session?.user) {
          setIsAuthenticated(true);
          await fetchUserProfile(data.session.access_token);
        }
      } catch (error) {
        console.error('Initial auth check error:', error);
      } finally {
        setIsLoading(false);
      }
    };

    // Initialize
    initializeAuth();

    // Set up auth listener
    const { subscription } = supabase.auth.onAuthStateChange(handleAuthChange);

    // Cleanup
    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  const fetchUserProfile = async (accessToken) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-profile`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });
      if (!response.ok) {
        throw new Error("Error fetching user profile resource.")
      }
      const responseData = await response.json();
      setUsername(responseData.username);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setUsername("");
    }
  };

	return (
    <BrowserRouter>
      <div className="backgroundImage">
        {isAuthenticated ? (
            <Navbar isProfileDisabled={false} username={username} />
          ) : (
            <Navbar isProfileDisabled={true} username={username} />
          )}
        <main className='main-content'>
          <Routes>
            {/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/edit-profile" element={
              <ProtectedRoute>
                <EditProfile />
              </ProtectedRoute>
            } />
            <Route path="/forgot-password" element={
                <ForgotPassword/>
            } />
            <Route
              path="/reset-password"
              element={
              <ProtectedRoute>
                  < ResetPassword />
              </ProtectedRoute>
              }
            />
            <Route path="/join-create-game" element={
              <ProtectedRoute>
                <JoinCreateGame username={username}/>
              </ProtectedRoute>
            } />
            <Route path="/game-room" element={
              <ProtectedRoute>
                <GameRoom />
              </ProtectedRoute>
            } />
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

