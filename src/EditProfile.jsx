import { useState, useEffect } from "react";
import { Button, Input, Card, CardHeader, CardBody, Divider } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';
import supabase from './config/supabaseClient'
import AlertModal from "./components/AlertModal";

const EditProfile = () => {
  const navigate = useNavigate();
  
  // Form states
  const [username, setUsername] = useState("");
  const [currentEmail, setEmail] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [currentPasswordForEmailChange, setCurrentPasswordForEmailChange] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  
  // UI states
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false);

  const handleUpdateProfile = async ({ authUtils }) => {
    try {
      // Your existing update profile logic

      // After successful update:
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      // Update auth state
      authUtils.setIsAuthenticated(false);
      authUtils.setUsername("");

      // Navigate to login
      navigate('/login');

    } catch (error) {
      // Your error handling
    }
  };

  // Fetch user profile data on component mount
  useEffect(() => {
    const fetchProfileData = async () => {
      try {

        const { data: user } = await supabase.auth.getSession();
        if (!user) {
          throw new Error("Authentication error. Could not retrieve active session. Please try logging in again.")
        }
        
        const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-profile`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${user.session.access_token}`
          },
        });

        const data = await response.json();

        if (!response.ok) {
    
          let errorMessages = "";
    
          if (data.error) {
            // Single error message
            errorMessages = data.error;
          } else if (data.errors) {
            // Multiple errors, combine them into a single message string
            errorMessages = Object.values(data.errors).join(" ");
          } else {
            // Unexpected error format
            errorMessages = "An unknown error occurred. Please try again.";
          }
    
          throw new Error(errorMessages);
        }

        setUsername(data.username);
        setEmail(data.email);

      } catch (error) {
        setAlertMessage(error.message);
        setAlertVisible(true);

      } finally {
        setLoading(false);

      }
    };

    fetchProfileData();
  }, []);

  const handleEmailChangeRequest = async () => {
    try {
      const { data: user } = await supabase.auth.getSession();
      if (!user) {
        throw new Error(
          "Authentication error. Could not retrieve active session. Please try logging in again."
        );
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-profile/email`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.session.access_token}`
        },
        body: JSON.stringify({
          currentEmail: currentEmail,
          newEmail: newEmail,
          currentPassword: currentPasswordForEmailChange 
        }),
      })


      const data = response.json()

      // Check if response is ok before parsing
      if (!response.ok) {
        console.log(data);
      
        let errorMessages = "";
      
        if (data.error) {
          // Single error message
          errorMessages = data.error;
        } else if (data.errors) {
          // Multiple errors, combine them into a single message string
          errorMessages = Object.values(data.errors).join(" ");
        } else {
          // Unexpected error format
          errorMessages = "An unknown error occurred. Please try again.";
        }
      
        throw new Error(errorMessages);
      }


    setAlertVisible(true)
    setAlertMessage("Your email has changed successfully!");

    if (!alertVisible){
      setTimeout(() => {
        navigate(`/login`) // redirect to join-create-game
      }, 2000)
    }

    } catch (error) {

      setAlertMessage(error.message || "An error occured when trying to send your request email change... Please try again later.")
      setAlertVisible(true)

    } finally {
      setLoading(false)

    }
  }

  const handlePasswordChange = async () => {
    try {
      const { data: user } = await supabase.auth.getSession();
      if (!user) {
        throw new Error(
          "Authentication error. Could not retrieve active session. Please try logging in again."
        );
      }

      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/auth/user-profile/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${user.session.access_token}`
        },
        body: JSON.stringify({
          currentEmail: currentEmail,
          currentPassword: currentPassword,
          newPassword: newPassword,
          confirmNewPassword: confirmNewPassword 
        }),
      })

      const data = response.json()

      // Check if response is ok before parsing
      if (!response.ok) {
        console.log(data);
      
        let errorMessages = "";
      
        if (data.error) {
          // Single error message
          errorMessages = data.error;
        } else if (data.errors) {
          // Multiple errors, combine them into a single message string
          errorMessages = Object.values(data.errors).join(" ");
        } else {
          // Unexpected error format
          errorMessages = "An unknown error occurred. Please try again.";
        }

        throw new Error(errorMessages);
      }


    setAlertVisible(true)
    setAlertMessage("Your password has succesfully changed!");

    if (!alertVisible){
      setTimeout(() => {
        navigate(`/join-create-game`) // redirect to join-create-game
      }, 2000)
    }

    } catch (error) {

      setAlertMessage(error.message || "An error occured when trying to update your password... Please try again later.")
      setAlertVisible(true)

    } finally {
      setLoading(false)

    }
  }

  const handleBack = () => {
    navigate('/join-create-game');
  }
  const toggleShowPassword = () => { 
    setShowPassword(!showPassword); 
  }
  const handleCloseAlert = () => {
    setAlertVisible(false);
    setAlertMessage("");
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <>
      {alertVisible && (
        <AlertModal 
          isOpen={alertVisible} 
          onClose={handleCloseAlert} 
          message={alertMessage}
          size="lg" 
        />
      )}

      <div className="flex flex-col items-center text-card-text p-4 gap-4">
        <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
          <div>
            <ArrowLeftIcon 
              className="h-7 w-7 cursor-pointer text-accent hover:text-divider-500" 
              onClick={handleBack} 
            />
          </div>
          
          <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">
            Edit Profile
          </CardHeader>

          <CardBody className="flex flex-col gap-4">
            <div className="flex flex-col gap-4">
              <Input
                color="primary"
                disabled
                clearable
                underlined
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
              <Input
                color="primary"
                disabled
                underlined
                placeholder="Email"
                value={currentEmail}
                onChange={(e) => setEmail(e.target.value)}
              />
              <Input
                color="primary"
                isRequired
                clearable
                underlined
                placeholder="New Email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
              />
              
              <div className="flex justify-center gap-3">
                <Button
                  className="w-auto text-white rounded-lg font-semibold transition duration-300 my-3"
                  color="success"
                  onClick={handleEmailChangeRequest}
                >
                  Change email
                </Button>
              </div>

              <Divider color="divider" />

              <Input
                color="primary"
                isRequired
                clearable
                underlined
                placeholder="Current Password"
                type={showPassword ? "text" : "password"}
                value={currentPassword}
                className="mt-3"
                onChange={(e) => setCurrentPassword(e.target.value)}
              />
              <Input
                color="primary"
                isRequired
                clearable
                underlined
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
              <Input
                color="primary"
                isRequired
                clearable
                underlined
                placeholder="Repeat New Password"
                type={showPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
              />

              <div className="flex justify-between items-center">
                <label 
                  className="cursor-pointer text-sm text-gray-500" 
                  onClick={toggleShowPassword}
                >
                  {showPassword ? "Hide Password" : "Show Password"}
                </label>
              </div>
            </div>

            <div className="flex justify-center gap-3">
              <Button
                className="w-auto text-white rounded-lg font-semibold transition duration-300"
                color="success"
                onClick={handlePasswordChange}
              >
                Change password
              </Button>
            </div>
          </CardBody>
        </Card>
      </div>
    </>
  );
};

export default EditProfile;