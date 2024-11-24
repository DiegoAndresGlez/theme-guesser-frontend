import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/solid";
import supabase from "./config/supabaseClient";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: "", type: "" }); // type can be 'success' or 'error'
  const navigate = useNavigate();

  const handleResetPasswordRequest = async () => {
    if (!email) {
      setMessage({ text: "Please enter your email address", type: "error" });
      return;
    }

    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) throw error;

      setMessage({
        text: "Check your email for the reset link",
        type: "success"
      });

      // Optional: Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);

    } catch (error) {
      setMessage({
        text: error.message || "Failed to send reset link",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/login');
  };

  return (
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <div>
          <Button 
            className="rounded-full p-2 bg-accent flex items-center justify-center" 
            onClick={handleBack}
          >
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
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
              onChange={(e) => setEmail(e.target.value)} />
            {message.text && (
              <div className={`text-${message.type === 'success' ? 'green' : 'red'}-500 text-sm text-center`}>
                {message.text}
              </div>
            )}
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleResetPasswordRequest}
              disabled={isLoading}
            >
              {isLoading ? "Sending..." : "Request password change"}
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPassword;