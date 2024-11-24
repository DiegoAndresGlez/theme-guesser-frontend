import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import supabase from "./config/supabaseClient";
import AlertModal from "./components/AlertModal";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const navigate = useNavigate();

  const handleResetPasswordRequest = async () => {
    if (!email) {
      setAlertMessage("Please enter a valid email");
      setIsAlertOpen(true);
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setAlertMessage("Request sent! Check your email for the reset link")
      setIsAlertOpen(true)

      // Optional: Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setAlertMessage(error.message || "Failed to send reset link");
      setIsAlertOpen(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseAlert = () => {
    setIsAlertOpen(false);
    setAlertMessage("")
  }; 

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <AlertModal
        isOpen={isAlertOpen}
        onClose={handleCloseAlert}
        message={alertMessage}
        size="md"
      />

      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <div>
          <ArrowLeftIcon
            className="h-7 w-7 cursor-pointer text-accent hover:text-divider-500"
            onClick={handleBack}
          />
        </div>
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0 b-4 my-3">
          Forgot Password
        </CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <Input
              color="primary"
              isRequired
              clearable
              underlined
              type="email"
              placeholder="Email"
              value={email}
              className="my-2"
              disabled={isLoading}
              onChange={(e) => setEmail(e.target.value)} 
            />
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleResetPasswordRequest}
              disabled={isLoading}
            >
              {isLoading ? "Requesting..." : "Request change"}
            </Button>
          </div>
        </CardBody>
      </Card>

    </div>
  );
};

export default ForgotPassword;