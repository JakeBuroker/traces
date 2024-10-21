import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button, Typography, Link } from '@mui/material';
import axios from "axios";

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
    marginBottom: '10px',
  },
  buttonContainer: {
    marginTop: '20px',
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
  text: {
    marginTop: '10px',
  },
};

export default function ResetPasswordCodeConfForm() {
  const [codeAttempt, setCodeAttempt] = useState('');
  const [email, setEmail] = useState('')
  const resetCodeStore = useSelector((store) => store.email);
  const [_resetCode, resetEmail] = resetCodeStore.emailReducer;
  const history = useHistory();

  const submitCode = async (event) => {
    event.preventDefault();
    const codeMatches = await resetCodeIsValid(email, codeAttempt)
    if (codeMatches) {
      history.push('/reset-password-page');
    } else {
      alert("Incorrect code. Please try again.");
    }
  };

  const resetCodeIsValid = async (email, code) => {
    const response = await axios.post('/api/email/check/reset-code', { email, code })
    const { codeMatches } = response.data
    return codeMatches
  }

  useEffect(() => {
    if (resetEmail) {
      setEmail(resetEmail)
    }
  }, [resetEmail])

  return (
    <div className="login-container">
      <form onSubmit={submitCode}>
        <h2 style={{ padding: '30px', textAlign: 'center', color: '#000000' }}>Enter Reset Code</h2>
        <div style={styles.inputContainer}>
          <label style={styles.labels}>Email</label>
          <input
            type="text"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            style={styles.input}
            required
          />
          <label style={styles.labels}>Code</label>
          <input
            type="text"
            value={codeAttempt}
            onChange={(event) => setCodeAttempt(event.target.value)}
            style={styles.input}
            placeholder="Enter the code"
            required
          />
        </div>
        <div style={styles.buttonContainer}>
          <Button type="submit" style={styles.button}>
            Submit
          </Button>
        </div>
        <div>
          <Typography sx={styles.text} variant='body1'>Didn't receive a code? Try checking your spam mail or <Link component={'button'} onClick={() => history.push('/reset-password-email')}>request another code</Link>.</Typography>
        </div>
      </form>
    </div>
  );
}
