import { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";

const ForgotPasswordConfirm = () => {
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleResetPassword = () => {
    // Logic for password reset
    // Show alert modal
    // Redirect to login
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">
          Forgot Password
        </CardHeader>
        <CardBody className="flex flex-col gap-6 p-4">
          <div className="flex flex-col gap-4">
            <Input
              isRequired
              clearable
              underlined
              placeholder="New Password"
              type={showPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <Input
              isRequired
              clearable
              underlined
              placeholder="Confirm Password"
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
              onClick={handleResetPassword}
            >
              Update
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default ForgotPasswordConfirm;
