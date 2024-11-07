// ConfirmSignUp.js
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import supabase from '../config/supabaseClient'; // Adjust the import according to your setup

const ConfirmSignUp = () => {
    const location = useLocation();

    useEffect(() => {
        const confirmEmail = async () => {
            const params = new URLSearchParams(location.search);
            const token = params.get('token');
            const type = params.get('type');

            // TODO pass in email
            if (token && type === 'signup') {
                const { error } = await supabase.auth.verifyOtp({ token, type });

                if (error) {
                    console.error('Error confirming email:', error);
                } else {
                    // Redirect to login or home page after successful confirmation
                    window.location.href = '/login'; // or wherever you want to redirect
                }
            }
        };

        confirmEmail();
    }, [location]);

    return (
        <div>
            <h2>Confirming your account...</h2>
            <p>Please wait...</p>
        </div>
    );
};

export default ConfirmSignUp;
