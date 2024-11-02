import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import { useNavigate } from "react-router-dom"
import { ArrowLeftIcon } from "@heroicons/react/24/solid";

const ForgotPasswordEmail = () => {
  const [email, setEmail] = useState("");
  const navigate = useNavigate()

  const handleResetPasswordRequest = () => {
    // Logic for password reset
  };

  const handleBack = () => {
    // Logic for navigating back to login
    navigate('/login')
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
              isRequired
              clearable
              underlined
              placeholder="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="my-2"
            />
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleResetPasswordRequest}
            >
              Request password change
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPasswordEmail;
