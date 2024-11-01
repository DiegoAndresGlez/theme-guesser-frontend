
import supabase from "../config/supabaseClient";
import { useState } from "react"
import { useNavigate } from "react-router-dom";
import {Navbar, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import ProfileIcon from "./ProfileIcon";
import AlertModal from "./AlertModal";
import { useEffect } from "react";

const NavBar = () => {
  const [isProfileDisabled, setIsProfileDisabled] = useState(true)
  const [alertMessage, setAlertMessage] = useState("");
  const [alertVisible, setAlertVisible] = useState(false)
  const navigate = useNavigate('/login')

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkUserSession = async () => {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
            console.error('Error fetching user:', error.message);
            setIsProfileDisabled(true);
            return;
        }
        setIsProfileDisabled(!data.session?.user)
    };

    checkUserSession();

    // Correct subscription syntax
    const { data: { subscription }, } = supabase.auth.onAuthStateChange((_, session) => {
        setIsProfileDisabled(!session?.user);
    });

    // Clean up subscription
    return () => {
        if (subscription) subscription.unsubscribe();
    };
  }, []);

  const handleSignOut = async () => {
    const { error } = await supabase.auth.signOut()

    if (error) {
      throw new Error(error.message)
    }

    setAlertMessage("Signing out...")
    setAlertVisible(true)

    setTimeout(() => {
      navigate('/login')
      handleCloseAlert()
    }, 2500)

  }

  const handleCloseAlert = () => {
    setAlertVisible(false)
    setAlertMessage("")
  }

  return (
    <>
    {alertVisible && (< AlertModal 
      isOpen={alertVisible} 
      onClose={handleCloseAlert} 
      message={alertMessage}
      size="lg" />)}

    <Navbar
      position="static"
      isBlurred={false}
      // className="bg-gradient-to-b from-secondary-700 to-primary-500"
      style={{ backgroundColor: "transparent" }}
    >
      <NavbarContent justify="end">
        <NavbarItem>
          <div className="flex gap-4 items-center">
            <Dropdown placement="bottom-end" className="bg-primary-800">
              <DropdownTrigger>
                <Button
                  isIconOnly
                  color="transition-transform"
                  className="bg-primary-800"
                  aria-label="Profile Icon"
                  radius="full"
                  size="lg"
                  isDisabled={isProfileDisabled}
                >
                  <ProfileIcon label="Profile Icon" />
                </Button>
              </DropdownTrigger>
              <DropdownMenu aria-label="Profile Actions" variant="flat">
                <DropdownItem
                  key="profile"
                  className="h-14 gap-2"
                  isReadOnly={true}
                >
                  <p className="font-semibold">Signed in as</p>
                  <p className="font-semibold">zoey@example.com</p>
                </DropdownItem>
                <DropdownItem key="edit-profile">Edit Profile</DropdownItem>
                <DropdownItem key="logout" color="danger" onClick={handleSignOut}>
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
    </>
  );
}

export default NavBar