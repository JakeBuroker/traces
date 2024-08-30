import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import './LoginForm.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ResetPasswordBtn from '../ResetPasswordBtn/ResetPasswordBtn.jsx';
import { Padding } from '@mui/icons-material';

function LoginForm() {
  const [formValues, setFormValues] = useState({
    username: 'Enter your username',
    password: 'Enter your password',
  });
  const errors = useSelector(store => store.errors);
  const user = useSelector(store => store.user);
  const history = useHistory();
  const dispatch = useDispatch();

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  };

  const handleFocus = (event) => {
    const { name } = event.target;
    if (formValues[name] === 'Enter your username' || formValues[name] === 'Enter your password') {
      setFormValues(prevValues => ({
        ...prevValues,
        [name]: '',
      }));
    }
  };

  const login = (event) => {
    event.preventDefault();
    if (formValues.username && formValues.password) {
      dispatch({
        type: 'LOGIN',
        payload: formValues,
      });
    } else {
      dispatch({ type: 'LOGIN_INPUT_ERROR' });
    }
  };

  useEffect(() => {
    if (user.id) {
      history.push('/user');
    }
  }, [user.id, history]);

  return (
    <div className="login-container" style={{ marginTop: "20px" }}>
      <form className="formPanel" onSubmit={login}>
        {errors.loginMessage && (
          <h3 className="alert" role="alert">
            {errors.loginMessage}
          </h3>
        )}
        <div className="input-container">
          <h4 htmlFor="username" style={{ color: '#000000' }}>
            Username:
          </h4>
          <input
            type="text"
            name="username"
            required
            value={formValues.username}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Enter your username"
          />
        </div>
        <div className="input-container">
          <h4 htmlFor="password" style={{ color: '#000000' }}>
            Password:
          </h4>
          <input
            type="password"
            name="password"
            required
            value={formValues.password}
            onChange={handleChange}
            onFocus={handleFocus}
            placeholder="Enter your password"
          />
        </div>
        <div>
          <Button className="btn" type="submit" name="submit" value="Log In" style={{marginTop: '10px'}}>
            Login
          </Button>
          <ResetPasswordBtn />
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
