import React from "react";
import { Link } from "react-router-dom";
import LogOutButton from "../LogOutButton/LogOutButton";
import "./Nav.css";
import { useSelector } from "react-redux";
import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Box } from "@mui/material";

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title" style={{color: 'white'}}>Traces</h2>
      </Link>
      <div >
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <>
            <Box >
              <Dropdown>
                <MenuButton sx={{ marginRight: "10px", color: "black" }}>
                  <MenuIcon />
                  <Menu sx={{ backgroundColor: "#c40f0f", border: "black" }}>
                    <MenuItem>
                      <Link className='navLink' to='/'>
                        Home
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link className="navLink" to="/about">
                        About
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link className="navLink" to="/gallery">
                        Gallery
                      </Link>
                    </MenuItem>
                    <MenuItem>
                      <Link className="navLink" to="/login">
                        Login
                      </Link>
                    </MenuItem>
                  </Menu>
                </MenuButton>
              </Dropdown>
            </Box>
          </>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
            <Dropdown>
              <MenuButton sx={{ marginRight: "10px", color: "black" }}>
                <MenuIcon />
              </MenuButton>
              <Menu sx={{ backgroundColor: "#c40f0f", border: "black" }}>
                <MenuItem
                  sx={{
                    "&:hover": {
                      backgroundColor: "#c40f0 !important",
                    },
                  }}
                >
                  <Link className="navLink" to="/user">
                    Home
                  </Link>
                </MenuItem>

                <MenuItem

                >
                  <Link className="navLink" to="/admin">
                    Admin Page
                  </Link>
                </MenuItem>
                <MenuItem

                >
                  <Link className="navLink" to="/about">
                    About
                  </Link>
                </MenuItem>

                <MenuItem

                >
                  <Link className="navLink" to="/gallery">
                    Gallery
                  </Link>
                </MenuItem>

                <MenuItem

                >
                  <Link className="navLink" to="/Evidence">
                    Evidence
                  </Link>
                </MenuItem>

                <MenuItem

                >
                  <Link className="navLink" to="/help">
                    Help
                  </Link>
                </MenuItem>

                <MenuItem

                >
                  <LogOutButton className="navLink" />
                </MenuItem>
              </Menu>
            </Dropdown>
          </>
        )}
      </div>
    </div>
  );
}

export default Nav;
