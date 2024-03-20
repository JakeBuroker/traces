import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Select, MenuItem, FormControl, Snackbar, Alert } from '@mui/material';

function RegisterForm() {
  // State hooks for form inputs and Snackbar visibility
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('')
  const [phoneNumber, setPhoneNumber] = useState('')
  const [fullName, setFullName] = useState('')
  const [role, setRole] = useState(1) // Default role set to '1' for Audience Member
  const [snackBarOpen, setSnackBarOpen] = useState(false)

  // Accessing the Redux store for any registration errors
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  // Handles the submission of the registration form
  const registerUser = (event) => {
    event.preventDefault(); // Prevents the default form submit action

    // Dispatching a register action with form data as payload
    dispatch({
      type: 'REGISTER',
      payload: {
        username,
        password,
        email,
        phone_number: phoneNumber,
        full_name: fullName,
        role
      },
    });

    // Showing the Snackbar upon successful registration
    setSnackBarOpen(true);
    // Resetting form state after dispatch
    resetState();
  };

  // Handles the closing of the Snackbar
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return; // Keeps the Snackbar open if the user clicks away
    }
    setSnackBarOpen(false); // Closes the Snackbar
  };

  // Resets all form inputs back to their default state
  const resetState = () => {
    setUsername('');
    setPassword('');
    setEmail('');
    setPhoneNumber('');
    setFullName('');
    setRole(1); // Resets role to default value
  }

  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={registerUser}>
        <h2 style={{ marginBottom: '50px' }}>Register User</h2>
        {/* Displaying registration errors from the Redux store */}
        {errors.registrationMessage && (
          <h3 className="alert" role="alert">
            {errors.registrationMessage}
          </h3>
        )}
        {/* Form inputs for user information */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {/* Repeated input fields for collecting user details */}
          {/* Each field updates its corresponding state on change */}
          
          {/* Input field for Full Name */}
          {/* Other input fields omitted for brevity */}
          
          {/* Role selection dropdown */}
          <div>
            <FormControl required sx={{ width: "100%", }}>
              <label htmlFor="roleInput" style={{ marginBottom: '10px' }}>Role: </label>
              <Select
                labelId="roleInput-label"
                id="roleInput"
                value={role}
                onChange={(e) => setRole(Number(e.target.value))}
                sx={{ border: 1, borderRadius: 4, height: 52 }}
                size='small'
              >
                {/* Option items for different user roles */}
                <MenuItem value={1}>Audience Member</MenuItem>
                <MenuItem value={2}>Administrator</MenuItem>
              </Select>
            </FormControl>
          </div>
        </div>
        {/* Buttons for submitting or canceling the registration */}
        <div>
          <Button className='btn' type='submit'>Register</Button>
          <Button className='btn' type='button' onClick={() => history.push('/admin')}>Back to Admin Page</Button>
        </div>
      </form>
      {/* Snackbar for displaying a success message upon registration */}
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
      >
        <Alert onClose={handleClose} severity="success" variant="filled" sx={{ width: '100%' }}>
          New User Created!
        </Alert>
      </Snackbar>
    </div>
  );
}

export default RegisterForm;