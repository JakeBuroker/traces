import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import { useState } from "react";

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
            <h1>Enter the email associated with your account:</h1>
            <form onSubmit={submitEmail}>
                Email: <input 
                    value={enterEmail}
                    onChange={(event) => setEnterEmail(event.target.value)}
                    required
                />
                <button>Submit</button>
            </form>
        </div>
    );
}
