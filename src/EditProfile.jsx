import React, { useState } from "react";
import { Button, Input, Card, CardHeader, CardBody } from "@nextui-org/react";
import InfoComponent from "./InfoComponent";
import { ArrowLeftIcon } from '@heroicons/react/24/solid';

const EditProfile = () => {
  const [username, setUsername] = useState("username");
  const [email, setEmail] = useState("email@email.com");
  const [newEmail, setNewEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSaveChanges = () => {
    // logic to save changes
  };

  const handleBack = () => {
    // for back button
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="flex flex-col items-center text-card-text p-4 gap-4">
      <Card className="w-full max-w-sm mt-2 shadow-lg bg-card-background rounded-xl border border-black p-4">
      <div>
          <Button className="rounded-full bg-accent" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5"/>
          </Button>
        </div>
        <CardHeader className="text-2xl flex flex-col items-center text-accent p-0">Edit Profile</CardHeader>
        <CardBody className="flex flex-col gap-4">
          <div className="flex flex-col gap-4">
          <Input
            isDisabled
            clearable
            underlined
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            isDisabled
            clearable
            underlined
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="New Email"
            value={newEmail}
            onChange={(e) => setNewEmail(e.target.value)}
          />
          <Input
            isRequired
            clearable
            underlined
            placeholder="Current Password"
            type={showPassword ? "text" : "password"}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
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
            placeholder="Repeat New Password"
            type={showPassword ? "text" : "password"}
            value={confirmNewPassword}
            onChange={(e) => setConfirmNewPassword(e.target.value)}
          />
          <div className="flex justify-between items-center">
            <label className="cursor-pointer text-sm text-gray-500" onClick={toggleShowPassword}>
              {showPassword ? "Hide Password" : "Show Password"}
            </label>
          </div>
          </div>
          <div className="flex justify-center gap-3">
            <Button
              className="w-auto text-white rounded-lg font-semibold transition duration-300"
              color="success"
              onClick={handleSaveChanges}
            >
              Accept
            </Button>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default EditProfile;
