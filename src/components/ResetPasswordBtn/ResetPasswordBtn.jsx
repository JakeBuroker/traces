import React from 'react';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export default function SendEmailBtn() {

    const dispatch = useDispatch()
    const history = useHistory()
    const sendEmail = () => {
  
        history.push('/reset-password-email')
    }

    return (
        <button onClick={sendEmail}>Reset Password?</button>
    )
}