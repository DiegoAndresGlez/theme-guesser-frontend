import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const ProtectedRoute = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const navigate = useNavigate();
    const location = useLocation();
  
    useEffect(() => {
      const checkAuth = async () => {
        const { data } = await supabase.auth.getSession(); // gets JWT token from browser's local storage
        setIsAuthenticated(!!data.session?.user);
        setIsLoading(false);
        
        if (!data.session?.user) {
          navigate('/login', { 
            state: { returnTo: location.pathname }
          });
        }
      };
      
      checkAuth();
    }, [location.pathname, navigate]);
  
    if (isLoading) return <div>Loading...</div>;
    
    return isAuthenticated ? children : null;
}

export default ProtectedRoute