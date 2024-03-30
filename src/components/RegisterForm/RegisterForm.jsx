import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Select, MenuItem, FormControl, Snackbar, Alert } from '@mui/material';


function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState(1)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory()

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
        role: role
      },
    });
    setSnackBarOpen(true)
    resetState()
  }; // end registerUser

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const resetState = () => {
    setUsername('')
    setPassword('')
    setEmail('')
    setPhoneNumber('')
    setFullName('')
    setRole(1)
  }

  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={registerUser}>
        <h2 style={{ marginBottom: '50px' }}>Register User</h2>
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
          <div>
            <FormControl required sx={{ width: "100%", }}>
              <label htmlFor="roleInpute" style={{ marginBottom: '10px' }}>Roll: </label>
              <Select
                sx={{ border: 1, borderRadius: 4, height: 52 }}
                size='small'
                labelId="roleInput-label"
                id="roleInput"
                value={role}
                onChange={(e) => setRole(Number(e.target.value))}
              >
                <MenuItem value={1}>Audience Member</MenuItem>
                <MenuItem value={2}>Administrator</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        <div>

        </div>
        <div>
          <Button className='btn' type='submit' name='submit' value='Register'>Register</Button>
          <Button className='btn' type='reset' onClick={() => history.push('/admin')}>Back to Admin Page</Button>
          {/* <input className="btn" type="submit" name="submit" value="Register" /> */}
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      // message="New User Created"
      >
        <Alert
          onClose={handleClose}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          New User Created!
        </Alert>
      </Snackbar>
    </div>

  );
}

export default RegisterForm;