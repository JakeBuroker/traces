import { useState } from "react";
import { useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { Button } from '@mui/material';

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
};

export default function ResetPasswordCodeConfForm() {
  const [codeAttempt, setCodeAttempt] = useState('');
  const resetCodeStore = useSelector((store) => store.email);
  const resetCode = resetCodeStore.emailReducer[0];
  const history = useHistory();

  const submitCode = (event) => {
    event.preventDefault();
    if (codeAttempt === resetCode) {
      history.push('/reset-password-page');
    } else {
      alert("Incorrect code. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={submitCode}>
        <h2 style={{ padding: '30px', textAlign: 'center', color: '#000000' }}>Enter Reset Code</h2>
        <div style={styles.inputContainer}>
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
      </form>
    </div>
  );
}
