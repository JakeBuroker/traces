import { useState } from "react";
import { useDispatch } from "react-redux";
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

export default function ResetPasswordEmailForm() {
  const history = useHistory();
  const dispatch = useDispatch();
  const [enterEmail, setEnterEmail] = useState('');

  const checkEmailExists = async () => {
    try {
      const response = await fetch('/api/email/check-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: enterEmail }),
      });
      const data = await response.json();
      return data.exists;
    } catch (error) {
      console.error('Error checking email:', error);
      return false;
    }
  };

  const submitEmail = async (event) => {
    event.preventDefault();
    const emailExists = await checkEmailExists();
    if (emailExists) {
      let randNum = Math.floor(100000 + Math.random() * 900000);
      let emailArr = [randNum, enterEmail];

      dispatch({ type: 'SEND', payload: emailArr });
      history.push('/reset-password-code');
    } else {
      alert("No account is registered with that email address");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submitEmail}>
        <h2 style={{ padding: '30px', textAlign: 'center', color: '#000000' }}>Reset Password</h2>
        <div style={styles.inputContainer}>
          <label style={styles.labels}>Email:</label>
          <input
            type="email"
            value={enterEmail}
            onChange={(event) => setEnterEmail(event.target.value)}
            style={styles.input}
            placeholder="Enter your email"
            required
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button type="submit" style={styles.button}>
            Submit
          </Button>
        </div>
      </form>
    </div>
  );
}
