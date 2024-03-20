import React, { useState } from 'react';
import { useDispatch, useSelector, } from 'react-redux';
import { Button } from '@mui/material';
import './LoginForm.css'; // Assuming you have a CSS file for styles
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

function LoginForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const errors = useSelector(store => store.errors);
  const history = useHistory();
  const dispatch = useDispatch();

  const login = (event) => {
    event.preventDefault();
    if (username && password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          username: username,
          password: password,
        },
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  }; 

  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={login}>
        <div className="image-container">
          {/* Assuming you want to include an image at the top, you can use an img tag here */}
          <img className="pageIcon" src="/fillerIconThree.jpg" alt="Login" style={{ width: 200, height: 200 }} />

        </div>

        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
        <div className="input-container">
        <h4 htmlFor="username" style={{color: '#f2f2f2'}}>
            Username:
            </h4>
          <input
            type="text"
            name="username"
            required
            value={username}
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="input-container">
          <h4 htmlFor="password" style={{color: '#f2f2f2'}}>
            Password:
          </h4>
          <input
            type="password"
            name="password"
            required
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />
        </div>
        <div>
          <Button className="btn" type="submit" name="submit" value="Log In">Login </Button>
          {/* <Button className="btn" type="button" onClick={() => (history.push("/registration"))}>Register</Button> */}
        </div>
      </form>
    </div>
  );
}

export default LoginForm;