import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import eyeIcon from "./assets/img/eye.png";
import blockedEyeIcon from "./assets/img/blocked-eye.png"; 
import supabase from "./config/supabaseClient";
import AlertModal from "./components/AlertModal";

const ResetPassword = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const navigate = useNavigate();

  const validatePassword = (password) => {
    const errors = [];

    // Check length (8-32 characters)
    if (password.length < 8 || password.length > 32) {
      errors.push("Password must be between 8 and 32 characters");
    }

    // Check for at least 1 number or special character
    if (!/(?=.*[0-9!@#$%^&*])/.test(password)) {
      errors.push("Password must have at least 1 number or a special character");
    }

    // Check for alphanumeric characters only
    if (!/^[a-zA-Z0-9!@#$%^&*]+$/.test(password)) {
      errors.push("Password must only contain alphanumeric and special characters");
    }

    // Check for whitespace
    if (/\s/.test(password)) {
      errors.push("Password must not contain whitespaces");
    }

    // Check if passwords match
    if (password !== confirmNewPassword) {
      errors.push("Passwords do not match");
    }

    if (errors.length > 0) {
      setAlertMessage(errors.join(". "));
      setIsAlertOpen(true);
      return false;
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword(newPassword)) {
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (error) throw error;

      setAlertMessage("Password has been changed successfully!");
      setIsAlertOpen(true);
      
      // Redirect after modal is closed
      setTimeout(() => {
        navigate('/login');
      }, 2000);

    } catch (error) {
      setAlertMessage(error.message || "Error when trying to update password");
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
  };

  return (
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">
          Reset Password
        </CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <div className="relative">
              <Input
                isRequired
                clearable
                underlined
                placeholder="New Password"
                type={showPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                disabled={isLoading}
              />

              <img
                src={showPassword ? blockedEyeIcon : eyeIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
                onClick={toggleShowPassword}
              />

            </div>
            <div className="relative">
              <Input
                isRequired
                clearable
                underlined
                placeholder="Confirm Password"
                type={showPassword ? "text" : "password"}
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                disabled={isLoading}
              />
              <img
                src={showPassword ? blockedEyeIcon : eyeIcon}
                alt={showPassword ? "Hide password" : "Show password"}
                className="absolute right-2 top-2 w-6 h-6 cursor-pointer"
                onClick={toggleShowPassword}
              />
            </div>
          </div>

          {/* Password Requirements */}
          <div className="text-sm text-white text-bold bg-primary-600 p-4 rounded-lg">
            <p className="font-bold mb-2">Password requirements:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Minimum 8 characters and maximum 32 characters</li>
              <li>Minimum 1 number or a special character</li>
              <li>Alphanumerical characters only</li>
              <li>No white space</li>
            </ol>
          </div>

          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleResetPassword}
              disabled={isLoading}
            >
              {isLoading ? "Updating..." : "Update"}
            </Button>
          </div>
        </CardBody>
      </Card>

      <AlertModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        message={alertMessage}
        size="md"
      />
    </div>
  );
};

export default ResetPassword;
