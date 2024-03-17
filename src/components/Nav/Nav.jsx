import Dropdown from "@mui/joy/Dropdown";
import Menu from "@mui/joy/Menu";
import MenuButton from "@mui/joy/MenuButton";
import MenuItem from "@mui/joy/MenuItem";
import MenuIcon from "@mui/icons-material/Menu";
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import "./Nav.css";

function Nav() {
  const user = useSelector((store) => store.user);
  const history = useHistory(); 
  const dispatch = useDispatch();

  const navigateTo = (path) => {
    history.push(path);
  };

  const Logout = () => {
    history.push('/');
    dispatch({type: "LOGOUT"});
  };

  return (
    <div className="nav">
      <div className="nav-title" onClick={() => navigateTo("/")}>
        Traces
      </div>
      <div className="nav-controls">
        {user.id && (
          user.avatar_url ?
            <img onClick={() => navigateTo('/user')} src={user.avatar_AWS_URL} alt="An avatar for the user." className="nav-avatar"/> :
            <img onClick={() => navigateTo('/user')} src="./default_avi.jpeg" alt='The default avatar' className="nav-avatar" />
        )}
        <Dropdown>
          <MenuButton sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white" } }}>
            <MenuIcon />
          </MenuButton>
          <Menu sx={{ padding:"20px", color: "white", fontSize:"20px", backgroundColor: "#18245A", border: "black" }}>
            {!user.id ? (
              <>
                <MenuItem onClick={() => navigateTo('/home')}  sx={{color: "white", '&:hover': {backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/about')} sx={{color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  About
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/login')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  Login
                </MenuItem>
              </>
            ) : (
              <>
                <MenuItem onClick={() => navigateTo('/home')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  Home
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/evidence')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                    Evidence
                  </MenuItem>
                {user.role === 2 && (
                  <MenuItem onClick={() => navigateTo('/admin')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                    Admin Page
                  </MenuItem>
                )}
                <MenuItem onClick={() => navigateTo('/about')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  About
                </MenuItem>
                <MenuItem onClick={() => navigateTo('/gallery')} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
                  Gallery
                </MenuItem>
                <MenuItem onClick={() => Logout()} sx={{ color: "white", '&:hover': { backgroundColor: "hsl(0, 85.78%, 45%) !important", color: "white !important" }}}>
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
