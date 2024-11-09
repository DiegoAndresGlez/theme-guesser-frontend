import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../config/supabaseClient';

const ConfirmSignUp = () => {
    const location = useLocation();
    const [email, setEmail] = useState('');

    useEffect(() => {
        const confirmEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const type = params.get('type');
            console.log(token)
            console.log(type)
            console.log(email)

            const { data } = await supabase.auth.getSession();

            if (token && type === 'signup') {
                // Fetch the user's email from the URL or your application state
                const { error } = await supabase.auth.verifyOtp( data.session.access_token.email );

                if (error) {
                    console.error('Error confirming email:', error);
                } else {
                    // Redirect to login or home page after successful confirmation
                    window.location.href = '/login';
                }
            }
        };

        confirmEmail();
    }, [location, email]);

    return (
        <div>
            <h2>Confirming your account...</h2>
            <p>Please wait...</p>
        </div>
    );
};

export default ConfirmSignUp;