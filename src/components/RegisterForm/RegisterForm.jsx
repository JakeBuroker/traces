import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { Button, Select, MenuItem, FormControl, Snackbar, Alert } from '@mui/material';
import { Formik } from 'formik';
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
    color: "#f7f7f7",
  },
  warningLabels: {
    color: '#c40f0f'
  }
}

function RegisterForm() {
  const [role, setRole] = useState(1)
  const [snackBarOpen, setSnackBarOpen] = useState(false)
  const errors = useSelector((store) => store.errors);
  const dispatch = useDispatch();
  const history = useHistory()
  const [formValues, setFormValues] = useState({})

  const registerUser = ({username, password, email, phone_number, full_name}) => {
    dispatch({
      type: 'REGISTER',
      payload: {
        username,
        password,
        email,
        phone_number,
        full_name,
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

  const FormFields = () => (
    <div>
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
            errors.phoneNumber = 'Required'
          } else if (values.phoneNumber.length < 10) {
            errors.phoneNumber = 'Invalid Phone Number'
          }

          // Phone number confirm
          if (!values.phoneNumberConfirm) {
            errors.phoneNumberConfirm = 'Required'
          } else if (values.phoneNumber !== values.phoneNumberConfirm) {
            errors.phoneNumberConfirm = 'Phone numbers must match'
          }

          // Email
          if (!values.email) {
            errors.email = 'Required';
          } else if (
            !/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)
          ) {
            errors.email = 'Invalid email address';
          }

          if (!values.password) {
            errors.password = 'Required'
          } else if (values.password.length < 7) {
            errors.password = 'Password must be at least 7 characters'
          }

          // Password Confirm 
          if (!values.passwordConfirm) {
            errors.passwordConfirm = 'Required'
          } else if (values.passwordConfirm.length < 7) {
            errors.passwordConfirm = 'Password must be at least 7 characters'
          } else if (values.passwordConfirm !== values.password) {
            errors.passwordConfirm = 'Passwords do not match'
          }
          return errors;
        }}
        onSubmit={(values, { setSubmitting }) => {
          setTimeout(() => {
            alert(JSON.stringify(values, null, 2));
            setFormValues({
              username: values.username,
              password: values.password,
              email: values.email,
              phone_number: values.phoneNumber,
              full_name: values.fullName,
            })
            registerUser({
              username: values.username,
              password: values.password,
              email: values.email,
              phone_number: values.phoneNumber,
              full_name: values.fullName,
            })
            setSubmitting(false);
          }, 400);
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
          /* and other goodies */
        }) => (
          <form onSubmit={handleSubmit} >
            <h2 style={{ marginBottom: '30px', textAlign: 'center', color: '#f7f7f7' }}>Register User</h2>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <div className="input-container">
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
                {errors.fullName && touched.fullName && errors.fullName}
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
                {errors.username && touched.username && errors.username}
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
                {errors.email && touched.email && errors.email}
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
                {errors.phoneNumber && touched.phoneNumber && errors.phoneNumber}
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
                {errors.phoneNumberConfirm && touched.phoneNumberConfirm && errors.phoneNumberConfirm}
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
                {errors.password && touched.password && errors.password}
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
                {errors.passwordConfirm && touched.passwordConfirm && errors.passwordConfirm}
              </div>
            </div>
            <Button type="submit" disabled={isSubmitting} className='btn'>
              Submit
            </Button>
          </form>
        )}
      </Formik>
    </div>
  );

  return (
    <div className="login-container">
      <FormFields />
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