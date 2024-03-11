import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Button } from '@mui/material';


function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState('')
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();

  const registerUser = (event) => {
    event.preventDefault();

    dispatch({
      type: 'REGISTER',
      payload: {
        username: username,
        password: password,
        email: email,
        phone_number: phoneNumber,
        full_name: fullName,
        role: 2 // TODO Change this to update with a selection.
      },
    });
  }; // end registerUser

  return (
    <div className="login-container">
    <form className="formPanel" onSubmit={registerUser}>
      <h2 style={{marginBottom: '50px'}}>Register User</h2>
      {errors.registrationMessage && (
        <h3 className="alert" role="alert">
          {errors.registrationMessage}
        </h3>
      )}
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <div className="input-container">
          <label htmlFor="fullName">
            Full Name:
          </label>
          <input
            type="text"
            id="fullName"
            value={fullName}
            required
            onChange={(event) => setFullName(event.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="username">
            Username:
          </label>
          <input
            type="text"
            id="username"
            value={username}
            required
            onChange={(event) => setUsername(event.target.value)}
          />
        </div>
        <div className="input-container">
          <label htmlFor="password">
            Password:
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
        </div>
        <div className="input-container">
          <label htmlFor="email">
            Email:
            <input
              type="text"
              id="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
        </div>
        <div className="input-container">
          <label htmlFor="phoneNumber">
            Phone Number:
            <input
              type="text"
              id="phoneNumber"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
          </label>
        </div>
        {/* // Todo add a input for role. */}
      </div>
      <div>

      </div>
      <div>
        <Button className='btn' type='submit' name='submit' value='Register'>Register</Button>
        {/* <input className="btn" type="submit" name="submit" value="Register" /> */}
      </div>
    </form>
  </div>

  );
}

export default RegisterForm;
