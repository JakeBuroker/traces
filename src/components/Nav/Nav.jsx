import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { Typography } from "@mui/material";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import "./Nav.css";

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

  return (
    <div className="nav">
      <div className="nav-title" onClick={() => navigateTo("/")}>
        <img src="./traces_logo_01.jpg" alt="Traces Logo" style={{ marginTop: '8px' }} />
      </div>
      <div className="nav-controls">
        {user.id && (
          user.avatar_url ?
            <img onClick={() => navigateTo('/user')} src={user.avatar_AWS_URL} alt="An avatar for the user." className="nav-avatar" /> :
            <img onClick={() => navigateTo('/user')} src="./default_avi.jpeg" alt='The default avatar' className="nav-avatar" />
        )}
        <Dropdown>
          <MenuButton
            sx={{
              color: "hsl(0, 0%, 97%)",
              '&:hover': {
                backgroundColor: "hsl(0, 85.78%, 45%) !important",
                color: "hsl(0, 0%, 97%)"
              },
              pointerEvents: user.id && !user.video_watched ? 'none' : 'auto',
              opacity: user.id && !user.video_watched ? 0.5 : 1
            }}
          >
            <MenuIcon />
          </MenuButton>
          <Menu sx={{ padding: "20px", color: "hsl(0, 0%, 97%)", fontSize: "20px", backgroundColor: "#c40f0f", border: "none" }}>
            {!user.id ? (
              <>
                <MenuItem onClick={() => navigateTo('/home')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/registration')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Register
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/login')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Login
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => navigateTo('/home')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/evidence')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Evidence
                </MenuItem>
                {user.role === 2 && (
                  <MenuItem onClick={() => navigateTo('/admin')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                    Admin Page
                  </MenuItem>
                )}
                <MenuItem onClick={() => navigateTo('/about')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  About
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/help')} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
                  Help
                </MenuItem>
                <MenuItem onClick={Logout} sx={{ color: "hsl(0, 0%, 97%)", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "hsl(0, 0%, 97%) !important" } }}>
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
