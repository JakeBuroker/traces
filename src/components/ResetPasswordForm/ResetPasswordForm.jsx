import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Alert } from '@mui/material';

const styles = {
  labels: {
    color: '#000000',
    fontWeight: 'bold',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  inputContainer: {
    marginBottom: '20px',
    width: '100%',
  },
  input: {
    width: '100%',
    padding: '15px 10px',
    fontSize: '17px', 
    border: '1px solid black',
    borderRadius: '5px',
    marginTop: '10px',
  },
  buttonContainer: {
    marginTop: '30px',
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#ffffff',
    color: '#000000',
    fontWeight: 'bold',
    width: '100%',
    padding: '10px',
    borderRadius: '10px',
    border: '0.5px solid black',
  },
  alert: {
    marginTop: '5px',
  },
};

export default function ResetPasswordForm() {
  const dispatch = useDispatch();
  const history = useHistory();
  const [firstEntry, setFirstEntry] = useState('');
  const [secondEntry, setSecondEntry] = useState('');
  const userEmail = useSelector((store) => store.email.emailReducer[1]);
  let updateInfo = [firstEntry, userEmail];

  const newPasswordSubmit = (event) => {
    event.preventDefault();
    if (firstEntry === secondEntry) {
      alert("Password updated successfully!");
      dispatch({ type: 'EDIT_PASSWORD', payload: updateInfo });
      history.push('/login');
    } else {
      alert("Please make sure that the passwords match each other.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={newPasswordSubmit}>
        <h2 style={{ padding: '30px', textAlign: 'center', color: '#000000' }}>Reset Password</h2>
        <div style={styles.inputContainer}>
          <label style={styles.labels}>New Password</label>
          <input
            type="password"
            value={firstEntry}
            onChange={(event) => setFirstEntry(event.target.value)}
            style={styles.input}
            placeholder="Enter new password"
            required
          />
        </div>
        <div style={styles.inputContainer}>
          <label style={styles.labels}>Confirm New Password</label>
          <input
            type="password"
            value={secondEntry}
            onChange={(event) => setSecondEntry(event.target.value)}
            style={styles.input}
            placeholder="Confirm new password"
            required
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button type="submit" style={styles.button}>
            Save New Password
          </Button>
        </div>
      </form>
    </div>
  );
}
