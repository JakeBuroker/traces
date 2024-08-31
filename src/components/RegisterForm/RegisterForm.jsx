import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Snackbar, Alert, Modal, Box } from '@mui/material';
import UploadButton from '../UploadButton/UploadButton';
import axios from 'axios';

const styles = {
  labels: {
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  uploadButton: {
    marginTop: "10px",
    backgroundColor: "#ffffff",
    color: "#000000",
  },
  alert: {
    marginTop: '5px',
  },
};

const modalStyle = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function RegisterForm() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [confirmPhoneNumber, setConfirmPhoneNumber] = useState('');
  const [fullName, setFullName] = useState('');
  const [role, setRole] = useState(1);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userAvi, setUserAvi] = useState(null);
  const [errors, setErrors] = useState({});
  const globalErrors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory();

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePhoneNumber = (phoneNumber) => {
    const phoneRegex = /^[0-9]{10}$/;
    return phoneRegex.test(phoneNumber);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const newErrors = {};

    if (password.length < 7) {
      newErrors.password = "Password must be at least 7 characters long";
    }
    if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }
    if (!validateEmail(email)) {
      newErrors.email = "Invalid email address";
    }
    if (!validatePhoneNumber(phoneNumber)) {
      newErrors.phoneNumber = "Phone number must be 10 digits long";
    }
    if (phoneNumber !== confirmPhoneNumber) {
      newErrors.confirmPhoneNumber = "Phone numbers do not match";
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {
      const response = await axios.post('/api/user/check', { username, email });
      if (response.data.exists) {
        setErrors({ username: response.data.message });
      } else {
        setModalOpen(true);
      }
    } catch (error) {
      console.error('Error checking user existence', error);
    }
  };

  const registerUser = () => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('full_name', fullName);
    formData.append('role', role);
    if (userAvi) {
      formData.append('verification_photo', userAvi);
    }

    dispatch({
      type: 'REGISTER',
      payload: formData,
    });
    setSnackBarOpen(true);
    resetState();
    history.push('/user');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const resetState = () => {
    setUsername('');
    setPassword('');
    setConfirmPassword('');
    setEmail('');
    setPhoneNumber('');
    setConfirmPhoneNumber('');
    setFullName('');
    setRole(1);
    setUserAvi(null);
    setErrors({});
  };

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  const clickCamera = () => {
    document.getElementById('cameraInput').click();
  };

  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={handleSubmit}>
        <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#000000' }}>Register User</h2>
        {globalErrors.registrationMessage && (
          <h3 className="alert" role="alert">
            {globalErrors.registrationMessage}
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="input-container">
            <label htmlFor="fullName" style={styles.labels}>
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={fullName}
              required
              onChange={(event) => setFullName(event.target.value)}
            />
            {errors.fullName && (
              <Alert severity="warning" style={styles.alert}>{errors.fullName}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="username" style={styles.labels}>
              Username
            </label>
            <input
              type="text"
              id="username"
              value={username}
              required
              onChange={(event) => setUsername(event.target.value)}
            />
            {errors.username && (
              <Alert severity="warning" style={styles.alert}>{errors.username}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="email" style={styles.labels}>
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(event) => setEmail(event.target.value)}
            />
            {errors.email && (
              <Alert severity="warning" style={styles.alert}>{errors.email}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="phoneNumber" style={styles.labels}>
              Phone Number
            </label>
            <input
              type="text"
              minLength={10}
              id="phoneNumber"
              value={phoneNumber}
              required
              onChange={(event) => setPhoneNumber(event.target.value)}
            />
            {errors.phoneNumber && (
              <Alert severity="warning" style={styles.alert}>{errors.phoneNumber}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="confirmPhoneNumber" style={styles.labels}>
              Confirm Phone Number
            </label>
            <input
              type="text"
              minLength={10}
              id="confirmPhoneNumber"
              value={confirmPhoneNumber}
              required
              onChange={(event) => setConfirmPhoneNumber(event.target.value)}
            />
            {errors.confirmPhoneNumber && (
              <Alert severity="warning" style={styles.alert}>{errors.confirmPhoneNumber}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="password" style={styles.labels}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete='new-password'
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && (
              <Alert severity="warning" style={styles.alert}>{errors.password}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="confirmPassword" style={styles.labels}>
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              required
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
            {errors.confirmPassword && (
              <Alert severity="warning" style={styles.alert}>{errors.confirmPassword}</Alert>
            )}
          </div>
        </div>
        <div>
          <Button className='btn' type='submit' name='submit' value='Register' style={{ margin: '10px 0px', color: 'blue' }}>Register</Button>
        </div>
      </form>
      <Snackbar
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        open={snackBarOpen}
        autoHideDuration={6000}
        onClose={handleClose}
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
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={modalStyle}>
          <h2 id="modal-modal-title">Please upload a clear photo of your face. This is required, but will be used for internal identification purposes only; it will NOT be shared publicly or with anyone outside the TRACES team</h2>
          <UploadButton
            btnName="Choose from Files"
            style={{
              marginTop: "10px",
              backgroundColor: "#ffffff",
              color: "#000000",
              border: "2px solid #000",
            }}
            onChange={handleFileChange}
          />
          <input
            id='cameraInput'
            type='file'
            accept='image/*'
            capture='environment'
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button
            variant="contained"
            onClick={clickCamera}
            style={{ marginTop: '10px', backgroundColor: "#ffffff", color: "#000000", border: "2px solid #000" }}
          >
            Take a Selfie
          </Button>
          <Button
            variant="contained"
            color="primary"
            onClick={() => {
              registerUser();
              handleModalClose();
            }}
            style={{ marginTop: '10px' }}
          >
            Submit Photo and Register
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RegisterForm;
