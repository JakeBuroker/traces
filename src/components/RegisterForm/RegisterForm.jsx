import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Snackbar, Alert, Modal, Box } from '@mui/material';
import { Formik } from 'formik';
import UploadButton from '../UploadButton/UploadButton';

const styles = {
  labels: {
    color: 'Black',
    fontWeight: 'bold',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
    marginBottom: '5px',
  },
  inputContainer: {
    marginBottom: '15px',
  },
  warningLabels: {
    color: '#c40f0f',
    fontSize: '0.875rem',
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
  const [role, setRole] = useState(1);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [userAvi, setUserAvi] = useState(null);
  const [formValues, setFormValues] = useState(null); // State to store form values
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = ({ username, password, email, phone_number, full_name }) => {
    const formData = new FormData();
    formData.append('username', username);
    formData.append('password', password);
    formData.append('email', email);
    formData.append('phone_number', phone_number);
    formData.append('full_name', full_name);
    formData.append('role', role); // Default set to 1 (user)
    if (userAvi) {
      formData.append('verification_photo', userAvi);
    }

    dispatch({
      type: 'REGISTER',
      payload: formData,
    });
    setSnackBarOpen(true);
    history.push('/user');
  };

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackBarOpen(false);
  };

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  const handleModalClose = () => {
    setModalOpen(false);
  };

  const handleSubmitWithPhoto = (values, setSubmitting) => {
    setSubmitting(false);
    setFormValues(values); // Store form values in state
    setModalOpen(true);
  };

  const handleModalSubmit = () => {
    if (formValues) {
      registerUser(formValues);
      handleModalClose();
    }
  };

  const clickCamera = () => {
    document.getElementById('cameraInput').click();
  };

  return (
    <div className="login-container">
      <Formik
        initialValues={{
          full_name: '',
          username: '',
          email: '',
          phone_number: '',
          phone_number_confirm: '',
          password: '',
          password_confirm: '',
        }}
        validate={values => {
          const errors = {};

          // Phone number
          if (!values.phone_number) {
            errors.phone_number = 'Required';
          } else if (values.phone_number.length < 10) {
            errors.phone_number = 'Invalid Phone Number';
          }

          // Phone number confirm
          if (!values.phone_number_confirm) {
            errors.phone_number_confirm = 'Required';
          } else if (values.phone_number !== values.phone_number_confirm) {
            errors.phone_number_confirm = 'Phone numbers must match';
          }

          // Email
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          // Password
          if (!values.password) {
            errors.password = 'Required';
          } else if (values.password.length < 7) {
            errors.password = 'Password must be at least 7 characters';
          }

          // Password Confirm
          if (!values.password_confirm) {
            errors.password_confirm = 'Required';
          } else if (values.password_confirm !== values.password) {
            errors.password_confirm = 'Passwords do not match';
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          handleSubmitWithPhoto(values, setSubmitting);
        }}
        className='formPanel'
      >
        {({
          values,
          errors,
          touched,
          handleChange,
          handleBlur,
          handleSubmit,
          isSubmitting,
        }) => (
          <form onSubmit={handleSubmit}>
            <h2 style={{ marginBottom: '30px', textAlign: 'center', color: 'Black' }}>Register User</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="full_name" style={styles.labels}>
                  Full Name*
                </label>
                <input
                  type="text"
                  name="full_name"
                  id='full_name'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.full_name}
                />
                {touched.full_name && errors.full_name && (
                  <div style={styles.warningLabels}>{errors.full_name}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="username" style={styles.labels}>
                  Username*
                </label>
                <input
                  type="text"
                  name="username"
                  id='username'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                />
                {touched.username && errors.username && (
                  <div style={styles.warningLabels}>{errors.username}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="email" style={styles.labels}>
                  Email*
                </label>
                <input
                  type="text"
                  name="email"
                  id='email'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.email}
                />
                {touched.email && errors.email && (
                  <div style={styles.warningLabels}>{errors.email}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="phone_number" style={styles.labels}>
                  Phone Number*
                </label>
                <input
                  type="text"
                  name="phone_number"
                  id='phone_number'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number}
                />
                {touched.phone_number && errors.phone_number && (
                  <div style={styles.warningLabels}>{errors.phone_number}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="phone_number_confirm" style={styles.labels}>
                  Confirm Phone Number*
                </label>
                <input
                  type="text"
                  name="phone_number_confirm"
                  id='phone_number_confirm'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phone_number_confirm}
                />
                {touched.phone_number_confirm && errors.phone_number_confirm && (
                  <div style={styles.warningLabels}>{errors.phone_number_confirm}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="password" style={styles.labels}>
                  Password*
                </label>
                <input
                  type="password"
                  name="password"
                  id='password'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password}
                />
                {touched.password && errors.password && (
                  <div style={styles.warningLabels}>{errors.password}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="password_confirm" style={styles.labels}>
                  Confirm Password*
                </label>
                <input
                  type="password"
                  name="password_confirm"
                  id='password_confirm'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.password_confirm}
                />
                {touched.password_confirm && errors.password_confirm && (
                  <div style={styles.warningLabels}>{errors.password_confirm}</div>
                )}
              </div>

              <Button type="submit" disabled={isSubmitting} className='btn'>
                Submit
              </Button>
            </div>
          </form>
        )}
      </Formik>
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
          <h2 id="modal-modal-title">Upload Verification Photo</h2>
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
            onClick={handleModalSubmit}
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
