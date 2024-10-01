import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';
import './LoginForm.css';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import ResetPasswordBtn from '../ResetPasswordBtn/ResetPasswordBtn.jsx';

function LoginForm() {
  const [formValues, setFormValues] = useState({
    usernameOrEmail: '',
    password: '',
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

  const login = (event) => {
    event.preventDefault();
    if (formValues.usernameOrEmail && formValues.password) {
      dispatch({
        type: 'LOGIN',
        payload: {
          usernameOrEmail: formValues.usernameOrEmail,
          password: formValues.password
        },
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
          <h4 htmlFor="usernameOrEmail" style={{ color: '#000000' }}>
            Username or Email:
          </h4>
          <input
            type="text"
            name="usernameOrEmail"
            required
            value={formValues.usernameOrEmail}
            onChange={handleChange}
            placeholder="Enter your username or email"
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
            placeholder="Enter your password"
          />
        </div>
        <div>
          <Button className="btn" type="submit" name="submit" value="Log In" style={{ marginTop: '10px' }}>
            Login
          </Button>
          <ResetPasswordBtn />
          <Button className='btn-reset' style={{marginTop: '20px'}} onClick={() => history.push('/registration')} >REGISTER</Button>
        </div>
      </form>
    </div>
  );
}

export default LoginForm;
