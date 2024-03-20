import React from 'react';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import './LandingPage.css';

function LandingPage() {
  const history = useHistory();

  const onLogin = () => {
    history.push('/login');
  };

  return (
    <Box className="container" sx={{ padding: '60px 20px' }}>
      <div className="grid">
        <div className='grid-col grid-col_12'>
          <img src="/bridge.jpg" alt="An image of a bridge" sx={{ display: 'block', width: '300px', margin: '25px auto', borderRadius: '5px' }} />
        </div>
        <div className="grid-col grid-col_12">
          <Button 
            variant="contained" 
            onClick={() => history.push('/registration')}
            sx={{
              backgroundColor: "#c40f0f", 
              color: "hsl(0, 0%, 97%)",
            }}
          >
            Register
          </Button>
        </div>

        <div className="grid-col grid-col_12">
          <Typography variant='body1' sx={{ color: 'hsl(0, 0%, 97%)', marginY: 2 }}>
            Welcome to Traces, the premier private investigator company where mysteries unravel and secrets are uncovered. 
            {/* Consider breaking this text into smaller paragraphs or sections for better readability */}
          </Typography>
        </div>
        <div className="grid-col grid-col_12" sx={{ marginTop: '25px' }}>
          <Typography variant="h6" sx={{ color: 'white' }}>
            If you are participating in the play, please login.
          </Typography>
          <Button variant="contained" onClick={onLogin} sx={{ backgroundColor: "#c40f0f", color: "hsl(0, 0%, 97%)" }}>
            Login
          </Button>
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
