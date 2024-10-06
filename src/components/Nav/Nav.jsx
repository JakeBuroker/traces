import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import "./Nav.css";
import { useEffect } from "react";

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const navigateTo = (path) => {
    if (user.video_watched || !user.id) {
      history.push(path);
    } else {
      alert('You must watch the video before navigating.');
    }
  };

  const Logout = () => {
    history.push('/');
    dispatch({ type: "LOGOUT" });
  };

  const menuItemStyle = {
    color: "#000000",
    padding: "10px 20px",
    border: "none",
    fontSize: "inherit", // Preserve existing font size
    transition: "background-color 0.3s ease, color 0.3s ease",
    '&:hover': {
      backgroundColor: "hsl(0, 0%, 99.50%) !important",
      color: "#dedede !important",
      borderRadius: "8px",
    }
  };

  return (
    <div className="nav">
      <div className="nav-title">
        <img
          src="/traces_logo_02.png"
          alt="TRACES logo" />
      </div>
      <div className="nav-controls">
        {user.id && (
          user.verification_photo ?
            <img onClick={() => navigateTo('/user')} src={user.verification_photo_AWS_URL} alt="An avatar for the user." className="nav-avatar" /> :
            <img onClick={() => navigateTo('/user')} src="./altered_avi2.jpeg" alt='The default avatar' className="nav-avatar" />
        )}
        <Dropdown>
          <MenuButton
            aria-label="Menu"
            sx={{
              border: 'solid 1px #000000',
              color: "#000000 !important",
              borderRadius: "8px",
              transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
              '&:hover': {
                backgroundColor: "hsl(0, 0%, 99.50%) !important",
                color: "#dedede !important",
                boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow on hover
                transform: 'scale(1.02)', // Slightly larger on hover
              },
              pointerEvents: user.id && !user.video_watched ? 'none' : 'auto',
              opacity: user.id && !user.video_watched ? 0.5 : 1
            }}
          >
            <MenuIcon />
          </MenuButton>
          <Menu
            sx={{
              boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', // Subtle shadow for depth
              borderRadius: '8px',
              padding: '10px 0',
              backgroundColor: '#ffffff',
              mt: '8px',
              '& .MuiMenuItem-root': {
                minHeight: '40px', // Consistent item height
              }
            }}
          >
            {!user.id ? (
              <>
                <MenuItem onClick={() => navigateTo('/home')} sx={menuItemStyle}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={menuItemStyle}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/registration')} sx={menuItemStyle}>
                  Register
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/login')} sx={menuItemStyle}>
                  Login
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => navigateTo('/home')} sx={menuItemStyle}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/evidence')} sx={menuItemStyle}>
                  Evidence
                </MenuItem>
                {user.role === 2 && (
                  <MenuItem onClick={() => navigateTo('/admin')} sx={menuItemStyle}>
                    Admin Page
                  </MenuItem>
                )}
                <MenuItem onClick={() => navigateTo('/gallery')} sx={menuItemStyle}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/help')} sx={menuItemStyle}>
                  Help
                </MenuItem>
                <MenuItem onClick={Logout} sx={menuItemStyle}>
                  Logout
                </MenuItem>
              </>
            )}
          </Menu>
        </Dropdown>
      </div>
    </div>
  );
}

export default Nav;
