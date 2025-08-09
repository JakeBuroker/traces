import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { Button, Typography, Box, Link } from '@mui/material';
import './LandingPage.css';
import { text } from './LandingPage.text';
import { useMemo } from 'react';

const styles = {
  registerButton: {
    marginTop: '15px'
  },
  container: {
    padding: '75px 20px'
  },
  body1: {
    color: 'black',
    textAlign: 'center',
    margin: '15px 0',
    fontFamily: 'Roboto',
    fontSize: '1.1rem',
    padding: '0 8px',
  },
  body2: {
    color: 'black',
    textAlign: 'center',
    margin: '15px 0',
    fontFamily: 'Roboto',
    fontSize: '2.1rem',
    fontWeight: 'bold',
    padding: '0 8px'
  }
}

function LandingPage({ inArchive }) {
  const user = useSelector((store) => store.user);
  const history = useHistory();

  const toLogin = () => {
    history.push('/login');
  };

  const toRegister = () => {
    history.push('/registration');
  };

  // Memoize user-related conditional rendering
  const userButtons = useMemo(() => {
    if (!user.id) {
      return !inArchive ? (<>
          <Button className="btn" onClick={toLogin}>
            Login
          </Button>
          <Button className="btn" onClick={toRegister} style={styles.registerButton}>
            Register
          </Button>
        </>) :  (<>
        <Button className='btn' onClick={() => history.push('/archive')}>See the Evidence</Button>
        </>)
    }
    return null;
  }, [user.id]);

  return (
    <Box className="container" sx={styles.container}>
      <div className="grid">
        <div className="grid-col grid-col_12">
          <img
            className="bridge-image"
            src="/bridge.jpg"
            alt="An image of a bridge"
            loading="lazy"
          />
        </div>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'center', 
          alignItems: 'center', 
          width: "100%", 
          flexDirection: "column",
           }}>
          {!user.id && (
            <>
              <Link sx={styles.body2} href="https://sites.google.com/view/spyontraces/" target='_blank'>
                CLICK HERE TO SPY ON TRACES
              </Link>
              {!inArchive && <h4 style={{textAlign: 'center'}}>(Do NOT register for an account unless you have a ticket)</h4>}
            </>
          )}
        </div>
        <div style={{height: '100px', width: '100%', display: 'block'}}>
          <div style={{border: '1px solid black', opacity: '25%', marginTop: '50px'}}></div>
        </div>
        {!user.id && !inArchive && (
          <Typography variant="body1" sx={{ ...styles.body1, whiteSpace: 'pre-wrap' }}>
            {"If you are participating in the "}
            <Link
              sx={{ fontWeight: 'bold', color: 'black' }}
              href="https://secure.walkerart.org/overview/13131"
              target='_blank'
            >{"investigation"}</Link>
            , please register or login.
          </Typography>
        )}
        <div className="grid-col grid-col_12">{userButtons}</div>
        <div className="grid-col grid-col_12">
          {user.id && (
            <>
              <Typography variant="body1" sx={{ ...styles.body1, whiteSpace: 'pre-wrap' }}>
                {text.english.landingPageBodies.body1}
              </Typography>
              <Typography variant='body1' sx={{ ...styles.body1, whiteSpace: 'pre-wrap', fontWeight: 'bold' }}>
                {text.english.landingPageBodies.body2}
              </Typography>
              <Typography variant="body1" sx={{ ...styles.body1, whiteSpace: 'pre-wrap' }}>
                {text.english.landingPageBodies.body3}
              </Typography>
            </>

          )}
        </div>
      </div>
    </Box>
  );
}

export default LandingPage;
