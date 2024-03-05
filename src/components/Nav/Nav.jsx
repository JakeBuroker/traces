import React from 'react';
import { Link } from 'react-router-dom';
import LogOutButton from '../LogOutButton/LogOutButton';
import './Nav.css';
import { useSelector } from 'react-redux';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import MenuIcon from '@mui/icons-material/Menu';

function Nav() {
  const user = useSelector((store) => store.user);

  return (
    <div className="nav">
      <Link to="/home">
        <h2 className="nav-title">Traces</h2>
      </Link>
      <div>
        {/* If no user is logged in, show these links */}
        {!user.id && (
          // If there's no user, show login/registration links
          <>
          <Dropdown>
            <MenuButton><MenuIcon/>
          <Menu>
            <MenuItem>
          <Link className="navLink" to="/login">
            Login / Register
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
          </Menu>
          </MenuButton>
          </Dropdown>
          </>
        )}

        {/* If a user is logged in, show these links */}
        {user.id && (
          <>
          <Dropdown>
          <MenuButton sx={{color: 'white'}}><MenuIcon/></MenuButton>
          <Menu sx={{bgcolor: '#d703d0'}}>
            <MenuItem>
            <Link className="navLink" to="/user">
              Home
            </Link>
            </MenuItem>
            <MenuItem>
            <Link className="navLink" to="/info">
              Info Page
            </Link>
            </MenuItem>

            <MenuItem>
            <Link className="navLink" to="/admin">
              Admin Page
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
            <Link className="navLink" to="/evidence">
            Evidence
             </Link>
             </MenuItem>

            <MenuItem>
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
