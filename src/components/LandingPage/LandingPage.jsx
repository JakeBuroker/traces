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
        <Button className="btn" onClick={onLogin}>
            Login
          </Button>
        </div>

        <div className="grid-col grid-col_12">
          <Typography variant='body1' sx={{color: '#f2f2f2'}}>
            Welcome to Traces, the premier private investigator company where mysteries unravel and secrets are uncovered.
            With our cutting-edge technology, keen intuition, and unwavering dedication to justice, Traces is renowned for solving the unsolvable.
            Whether it's tracking down elusive suspects, delving into clandestine affairs, or unearthing hidden truths,
            trust Traces to crack the case and deliver justice served with a twist. Join us on this thrilling journey into the heart of the unknown,
            where every clue is a piece of the puzzle waiting to be solved.
          </Typography>
        </div>
        <div className="grid-col grid-col_12" style={{ marginTop: '25px' }}>
          <h4 style={{color: '#f2f2f2'}}>If you are participating in the play, please login.</h4>
          <Button className="btn" onClick={onLogin}>
            Login
          </Button>
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
