import React, { useState } from "react";
import { Button, Input } from "@nextui-org/react";
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

  const infoTitle = "About";
  const infoContent = [
    "Update your profile details to keep your account information current.",
  ];

  return (
    <div className="flex flex-col items-center min-h-screend text-white p-6 space-y-8">
      <div className="w-full max-w-md bg-darkBlue rounded-lg shadow-lg text-center">
        <div className="w-full flex justify-start pl-4 pt-4">
          <Button className="rounded-full h-10 w-10 flex items-center justify-center p-0" onClick={handleBack}>
            <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
          </Button>
        </div>
        <div className="w-3/4 mx-auto space-y-6 pb-8 pl-8 pr-8">
          <h2 className="text-2xl mt-0">Edit Profile</h2>
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
          <Button onClick={handleSaveChanges} className="w-auto bg-green-600">
            Accept
          </Button>
        </div>
      </div>
      <InfoComponent title={infoTitle} content={infoContent} />
    </div>
  );
};

export default EditProfile;
