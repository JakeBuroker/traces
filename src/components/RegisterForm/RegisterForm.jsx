import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Select, MenuItem, FormControl, Snackbar, Alert } from '@mui/material';
import UploadButton from '../UploadButton/UploadButton';

const styles = {
  labels: {
    color: '#f7f7f7',
    fontWeight: 'bold',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  uploadButton: {
    marginTop: "10px",
    backgroundColor: "#c40f0f",
    color: "hsl(0, 0%, 97%)",
  }
}

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('')
  const [passwordsValid, setPasswordsValid] = useState(false)
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [phoneNumberConfirm, setPhoneNumberConfirm] = useState('')
  const [phoneNumbersValid, setPhoneNumbersValid] = useState(false)
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState(1)
  const [submitDisabled, setSubmitDisabled] = useState(false)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory()

  const registerUser = (event) => {
    event.preventDefault();
    validatePasswords()
    validatePhoneNumbers()
    if (!validateForm()) return
      dispatch({
        type: 'REGISTER',
        payload: {
          username: username,
          password: password,
          email: email,
          phone_number: phoneNumber,
          full_name: fullName,
          role: role // ! default set to 1 (user)
        },
      });
    setSnackBarOpen(true)
    resetState()
    history.push('/user')
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

  const validatePasswords = () => {
    if (password === passwordConfirm) {
      setPasswordsValid(true)
    } else {
      console.log('Passwords not matching');
      setPasswordsValid(false)
    }
  }

  const validatePhoneNumbers = () => {
    if (phoneNumber === phoneNumberConfirm) {
      setPhoneNumbersValid(true)
    } else {
      console.log('Phone numbers not matching');
      setPhoneNumbersValid(false)
    }
  }

  const validateForm = () => {
    if (phoneNumbersValid && passwordsValid) {
      // setSubmitDisabled(false)
      console.log('Form is valid');
      return true
    }
    // setSubmitDisabled(true)
    console.log("Form is not valid");
    return false

  }

  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={registerUser}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#f7f7f7' }}>Register User</h2>
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="input-container">
            <label htmlFor="fullName" style={styles.labels}>
              Full Name*
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
            <label htmlFor="username" style={styles.labels}>
              Username*
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
            <label htmlFor="email" style={styles.labels}>
              Email*
              <input
                type="email"
                id="email"
                value={email}
                required
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="phoneNumber" style={styles.labels}>
              Phone Number*
              <input
                type="text"
                minLength={10}
                id="phoneNumber"
                value={phoneNumber}
                required
                onChange={(event) => setPhoneNumber(event.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="confirmPhoneNumber" style={styles.labels}>
              Confirm Phone Number*
              <input
                type="text"
                minLength={10}
                id="confirmPhoneNumber"
                value={phoneNumberConfirm}
                required
                onChange={(event) => setPhoneNumberConfirm(event.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="password" style={styles.labels}>
              Password*
              <input
                type="password"
                id="password"
                value={password}
                autoComplete='new-password'
                required
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
          </div>
          <div className="input-container">
            <label htmlFor="password-confirm" style={styles.labels}>
              Confirm Password*
              <input
                type="password"
                id="password-confirm"
                value={passwordConfirm}
                required
                onChange={(event) => setPasswordConfirm(event.target.value)}
              />
            </label>
          </div>
          <UploadButton
            btnName={"Upload Avatar*"}
            color={"primary"}
            setter={() => { }}
            style={styles.uploadButton}
          />
        </div>
        <div>

        </div>
        <div>
          <Button
            className='btn'
            type='submit'
            name='submit'
            value='Register'
            disabled={submitDisabled}
            style={{ margin: '10px 0px', }}>
            Register
          </Button>
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