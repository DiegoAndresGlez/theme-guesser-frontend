import {Navbar, NavbarContent, NavbarItem, Button} from "@nextui-org/react";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@nextui-org/react";
import ProfileIcon from "./ProfileIcon";

const NavBar = () => {
  // const [username, setUsername] = useState("")

  return (
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
                <DropdownItem key="logout" color="danger">
                  Log Out
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </div>
        </NavbarItem>
      </NavbarContent>
    </Navbar>
  );
}

export default NavBar