import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Snackbar, Alert, Modal, Box, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import { styled } from '@mui/material/styles';
import UploadButton from '../UploadButton/UploadButton';
import axios from 'axios';

const styles = {
  modalTitle: {
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: 'Roboto',
    marginBottom: '15px',
    fontSize: '1.2rem',
    textAlign: 'left',
  },
  uploadButton: {
    marginTop: "10px",
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #000",
    width: '100%',
    padding: '10px',
    textTransform: 'none',
  },
  cameraButton: {
    marginTop: '10px',
    backgroundColor: "#ffffff",
    color: "#000000",
    border: "2px solid #000",
    width: '100%',
    padding: '10px',
    textTransform: 'none',
  },
  submitButton: {
    enabled: {
      marginTop: '10px',
      backgroundColor: "#ffffff",
      color: "#000000",
      border: "2px solid #000",
      width: '100%',
      padding: '10px',
      fontWeight: 'bold',
      textTransform: 'none',
    },
    disabled: {
      marginTop: '10px',
      backgroundColor: "#ffffff",
      color: "gray",
      border: "2px solid gray",
      width: '100%',
      padding: '10px',
      fontWeight: 'bold',
      textTransform: 'none',
    }
  },
  modalAlert: {
    marginTop: '15px',
  },
  modalStyle: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '90%',
    maxWidth: 500,
    bgcolor: 'background.paper',
    borderRadius: '10px',
    boxShadow: 24,
    p: 4,
  },
  dropDownStyle: {
    border: '1px'
  }
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
  const [pronouns, setPronouns] = useState('');
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
      newErrors.phoneNumber = "Phone number must be 10 digits long and contain no dashes";
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
    if (!userAvi) {
      setErrors({ userAvi: 'Please upload a photo' });
      return;
    }

    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('usernameOrEmail', email)
    formData.append('phone_number', phoneNumber);
    formData.append('full_name', fullName);
    formData.append('role', role);
    formData.append('verification_photo', userAvi);
    formData.append('pronouns', pronouns);

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
    setPronouns('')
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
  const additionalStyles = {
    formControl: {
      marginBottom: '10px',
      width: '100%',
      border: '1px',
    },
  };
  const StyledSelect = styled(Select)(({ theme }) => ({
    '& .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000000',
      borderWidth: '1px',
    },
    '&:hover .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000000',
    },
    '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#000000',
    },
  }));
  return (
    <div className="login-container">
      <form className="formPanel" onSubmit={handleSubmit}>
        <h2 style={{ textAlign: 'center', color: '#000000', padding: '3px' }}>Register User</h2>
        {globalErrors.registrationMessage && (
          <h3 className="alert" role="alert">
            {globalErrors.registrationMessage}
          </h3>
        )}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          <div className="input-container">
            <label htmlFor="fullName" style={styles.modalTitle}>
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
            <label htmlFor="username" style={styles.modalTitle}>
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
          <FormControl style={additionalStyles.formControl} className='input-container'>
            <label htmlFor='pronouns' style={styles.modalTitle}>
              Pronouns
            </label>
              <StyledSelect
                labelId="pronouns-label"
                id="pronouns"
                value={pronouns}
                onChange={(event) => setPronouns(event.target.value)}
              >
                <MenuItem value="">Prefer not to say</MenuItem>
                <MenuItem value="He/Him">He/Him</MenuItem>
                <MenuItem value="She/Her">She/Her</MenuItem>
                <MenuItem value="They/Them">They/Them</MenuItem>
                <MenuItem value="Other">Other</MenuItem>
              </StyledSelect>
          </FormControl>
          <div className="input-container">
            <label htmlFor="email" style={styles.modalTitle}>
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
            <label htmlFor="phoneNumber" style={styles.modalTitle}>
              Phone Number (10 digits, no dashes)
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
            <label htmlFor="confirmPhoneNumber" style={styles.modalTitle}>
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
            <label htmlFor="password" style={styles.modalTitle}>
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              autoComplete="new-password"
              required
              onChange={(event) => setPassword(event.target.value)}
            />
            {errors.password && (
              <Alert severity="warning" style={styles.alert}>{errors.password}</Alert>
            )}
          </div>
          <div className="input-container">
            <label htmlFor="confirmPassword" style={styles.modalTitle}>
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
          <Button className="btn" type="submit" name="submit" value="Register" style={styles.submitButton}>
            Register
          </Button>
        </div>
      </form>
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
      <Modal
        open={modalOpen}
        onClose={handleModalClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={styles.modalStyle}>
          <h2 id="modal-modal-title" style={styles.modalTitle}>
            Please upload a clear photo of your face. This is required, but will be used for internal identification purposes only; it will NOT be shared publicly or with anyone outside the TRACES team.
          </h2>
          <UploadButton 
          btnName="Choose from Files" 
          style={styles.uploadButton} 
          onChange={handleFileChange} 
          fileName={userAvi ? userAvi.name : ''}
          />
          {errors.userAvi && (
            <Alert severity="warning" style={styles.modalAlert}>
              {errors.userAvi}
            </Alert>
          )}
          <input
            id="cameraInput"
            type="file"
            accept="image/*"
            capture="environment"
            style={{ display: 'none' }}
            onChange={handleFileChange}
          />
          <Button variant="contained" onClick={clickCamera} style={styles.cameraButton}>
            Take a Selfie
          </Button>
          <Button
            variant="contained"
            onClick={registerUser}
            style={userAvi ? styles.submitButton.enabled : styles.submitButton.disabled}
            disabled={!userAvi}
          >
            Submit Photo and Register
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default RegisterForm;
