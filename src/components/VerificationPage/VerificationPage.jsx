import React from 'react';
import { useLocation } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { useHistory } from 'react-router-dom';

const VerificationPage = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const status = queryParams.get('status');
  const history = useHistory();

  const handleHomeRedirect = () => {
    history.push('/user');
  };

  return (
    <Container maxWidth="sm" style={{ marginTop: '100px' }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        textAlign="center"
        padding="20px"
        borderRadius="10px"
        boxShadow="0 0 15px rgba(0,0,0,0.1)"
        bgcolor="background.paper"
      >
          <>
            <CheckCircleOutlineIcon style={{ fontSize: 60, color: '#4caf50' }} />
            <Typography variant="h4" gutterBottom>
              Email Verified Successfully!
            </Typography>
            <Typography variant="body1" color="textSecondary">
              Thank you for verifying your email. Your account is now activated.
            </Typography>
            <Button
              variant="contained"
              style={{ marginTop: '20px', backgroundColor: "#ffffff", color: "#000000", }}
              onClick={handleHomeRedirect}
            >
              User Page
            </Button>
          </>
      </Box>
    </Container>
  );
};

export default VerificationPage;

