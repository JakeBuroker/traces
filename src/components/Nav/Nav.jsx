import React from "react";
import { useDispatch, useSelector } from "react-redux";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import { useHistory } from 'react-router-dom'; // Import useHistory

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory(); 
  const dispatch = useDispatch()

  const navigateTo = (path) => {
    history.push(path);
  };

  function Logout() {
    history.push('/')
    dispatch({type: "LOGOUT"})
  }

  return (
    <div className="nav">
      <div className="nav-title" onClick={() => navigateTo("/home")} style={{ color: "white", cursor: "pointer" }}>
        Traces
      </div>
      <div>
        {!user.id ? (
          <Box>
            <Dropdown>
              <MenuButton sx={{ marginRight: "10px", color: "white" }}>
                <MenuIcon />
              </MenuButton>
              <Menu sx={{  padding:"20px", color: "white", fontSize:"20px", backgroundColor: "#c40f0f", border: "black" }}>
                <MenuItem onClick={() => navigateTo('/')} sx={{color: "white",  '&:hover': {backgroundColor: "hsl(0, 85.78%, 45%) !important",color: "white !important"  } }}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/about')} sx={{color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"   } }}>
                  About
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"  } }}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/login')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important" } }}>
                  Login
                </MenuItem>
              </Menu>
            </Dropdown>
          </Box>
        ) : (
          <Dropdown>
            <MenuButton sx={{ marginRight: "10px",border: "white 2px solid", color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important",color: "white" }}}>
              <MenuIcon />
            </MenuButton>
            <Menu sx={{  padding:"20px", fontSize:"20px", backgroundColor: "#c40f0f", border: "black" }}>
              <MenuItem onClick={() => navigateTo('/user')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"  } }}>
                Home
              </MenuItem>
              {user.role === 2 && (
                <MenuItem onClick={() => navigateTo('/admin')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important" } }}>
                  Admin Page
                </MenuItem>
              )}
              <MenuItem onClick={() => navigateTo('/about')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"  } }}>
                About
              </MenuItem>
              <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"  } }}>
                Gallery
              </MenuItem>
              <MenuItem onClick={() => navigateTo('/evidence')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"   } }}>
                Evidence
              </MenuItem>
              <MenuItem onClick={() => navigateTo('/help')} sx={{ color: "white",'&:hover': { backgroundColor: "hsl(0, 85.78%, 45%)!important",color: "white !important"  } }}>
                Help
              </MenuItem>
              <MenuItem  onClick={() => Logout()} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important",color: "white !important"  } }}>
      Logout
              </MenuItem>
            </Menu>
          </Dropdown>
        )}
      </div>
    </div>
  );
}

export default Nav;
