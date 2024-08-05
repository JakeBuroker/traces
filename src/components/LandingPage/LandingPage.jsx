import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Box } from '@mui/material';
import './LandingPage.css';
import { text } from './LandingPage.text'

function LandingPage() {
  const user = useSelector(store => store.user)
  const history = useHistory();

  const toLogin = () => {
    history.push('/login');
  };

  const toRegister = () => {
    history.push('/registration')
  }

  return (
    <Box className="container" sx={{ padding: '65px 20px' }}>
      <div className="grid">
        <div className='grid-col grid-col_12'>
          <img src="/bridge.jpg" alt="An image of a bridge" style={{ display: 'block', width: '300px', margin: '25px auto', borderRadius: '5px' }} />
        </div>
        <div className="grid-col grid-col_12">
          {!user.id && (<>
            <Button className="btn" onClick={toLogin}>
              Login
            </Button>
            <Button className="btn" onClick={toRegister} style={{ marginTop: '15px' }}>
              Register
            </Button>
          </>)}
        </div>

        <div className="grid-col grid-col_12">
          <Typography variant='body1' sx={{ color: 'black', textAlign: "center" }}>
            {text.english.landingPageBodies.body1}
          </Typography>
        </div>
        <div className="grid-col grid-col_12" style={{ marginTop: '25px' }}>
          {!user.id && (<h4 style={{ color: '#000000' }}>If you are participating in the investigation, please register or login.</h4>)}
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
