import React from 'react';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';


export default function SendEmailBtn() {
    const history = useHistory()
    const sendEmail = () => {
        history.push('/reset-password-email')
    }

    return (
        <Button className='btn-reset' style={{marginTop: '20px'}} onClick={sendEmail}>Reset Password</Button>
    )
}