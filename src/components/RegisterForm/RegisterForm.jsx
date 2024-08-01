import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Snackbar, Alert } from '@mui/material';
import { Formik } from 'formik';


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
  }
}

function RegisterForm() {
  const [role, setRole] = useState(1);
  const [snackBarOpen, setSnackBarOpen] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const registerUser = ({ username, password, email, phone_number, full_name }) => {
    dispatch({
      type: 'REGISTER',
      payload: {
        username,
        password,
        email,
        phone_number,
        full_name,
        role: role // Default set to 1 (user)
      },
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

  return (
    <div className="login-container">
      <Formik
        initialValues={{
          fullName: '',
          username: '',
          email: '',
          phoneNumber: '',
          phoneNumberConfirm: '',
          password: '',
          passwordConfirm: '',
        }}
        validate={values => {
          const errors = {};

          // Phone number
          if (!values.phoneNumber) {
            errors.phoneNumber = 'Required';
          } else if (values.phoneNumber.length < 10) {
            errors.phoneNumber = 'Invalid Phone Number';
          }

          // Phone number confirm
          if (!values.phoneNumberConfirm) {
            errors.phoneNumberConfirm = 'Required';
          } else if (values.phoneNumber !== values.phoneNumberConfirm) {
            errors.phoneNumberConfirm = 'Phone numbers must match';
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
          if (!values.passwordConfirm) {
            errors.passwordConfirm = 'Required';
          } else if (values.passwordConfirm !== values.password) {
            errors.passwordConfirm = 'Passwords do not match';
          }

          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setSubmitting(false);
          registerUser({
            username: values.username,
            password: values.password,
            email: values.email,
            phone_number: values.phoneNumber,
            full_name: values.fullName,
          });
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
                <label htmlFor="fullName" style={styles.labels}>
                  Full Name*
                </label>
                <input
                  type="text"
                  name="fullName"
                  id='fullName'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.fullName}
                />
                {touched.fullName && errors.fullName && (
                  <div style={styles.warningLabels}>{errors.fullName}</div>
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
                <label htmlFor="phoneNumber" style={styles.labels}>
                  Phone Number*
                </label>
                <input
                  type="text"
                  name="phoneNumber"
                  id='phoneNumber'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phoneNumber}
                />
                {touched.phoneNumber && errors.phoneNumber && (
                  <div style={styles.warningLabels}>{errors.phoneNumber}</div>
                )}
              </div>

              <div className="input-container" style={styles.inputContainer}>
                <label htmlFor="phoneNumberConfirm" style={styles.labels}>
                  Confirm Phone Number*
                </label>
                <input
                  type="text"
                  name="phoneNumberConfirm"
                  id='phoneNumberConfirm'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.phoneNumberConfirm}
                />
                {touched.phoneNumberConfirm && errors.phoneNumberConfirm && (
                  <div style={styles.warningLabels}>{errors.phoneNumberConfirm}</div>
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
                <label htmlFor="passwordConfirm" style={styles.labels}>
                  Confirm Password*
                </label>
                <input
                  type="password"
                  name="passwordConfirm"
                  id='passwordConfirm'
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.passwordConfirm}
                />
                {touched.passwordConfirm && errors.passwordConfirm && (
                  <div style={styles.warningLabels}>{errors.passwordConfirm}</div>
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
    </div>
  );
}

export default RegisterForm;
