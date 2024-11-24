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
import ForgotPasswordConfirm from './ForgotPasswordConfirm.jsx'
import ForgotPasswordEmail from './ForgotPasswordEmail.jsx'
import JoinCreateGame from './JoinCreateGame.jsx'
import GameRoom from './GameRoom.jsx'

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState("")
  const [isLoading, setIsLoading] = useState(true)

	useEffect(() => {
    document.title = "Untitled - A Draw and Guess Game";
  }, []);

  // useEffect(() => {
  //   // Function to check the initial authentication status
  //   const checkAuth = async () => {
  //     const { data } = await supabase.auth.getSession();

  //     if (data) {
  //       fetchUserProfile(data.session.access_token)
  //     }

  //     setIsAuthenticated(!!data.session?.user);
  //   };

  //   // Check initial authentication status
  //   checkAuth();

  //   // Set up a listener for authentication state changes
  //   const { subscription } = supabase.auth.onAuthStateChange((event, session) => {
  //     setIsAuthenticated(!!session?.user);
  //   });

  //   // Cleanup the listener on component unmount
  //   return () => {
  //     subscription?.unsubscribe();
  //   };
  // }, []);


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
        { isAuthenticated ? (<Navbar isProfileDisabled={false} username={username}/>) : (<Navbar isProfileDisabled={true} username={username}/>)}
        <main className='main-content'>
          <Routes>
            {/* <Route path="/" element={<EmailVerificationHandler/>} /> */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUp />} />
            <Route path="/confirm-signup" element={<ConfirmSignUp/>}/>
            <Route path="/edit-profile" element={<EditProfile />} />
            <Route path="/forgot-password" element={
              // TODO: When finished all pages check do protectedroutes for all pages that are only accesible by auth user
              <ProtectedRoute>
                <ForgotPasswordEmail />
              </ProtectedRoute>
            } />
            <Route
              path="/forgot-password-confirm"
              element={<ForgotPasswordConfirm />}
            />
            <Route path="/join-create-game" username={username} element={<JoinCreateGame />} />
            <Route path="/game-room" element={<GameRoom/>} />
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

