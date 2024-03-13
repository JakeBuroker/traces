import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { Button } from '@mui/material';
import './LandingPage.css';

// CUSTOM COMPONENTS
import RegisterForm from '../RegisterForm/RegisterForm';

function LandingPage() {
  const [heading, setHeading] = useState('Traces');
  const history = useHistory();

  const onLogin = (event) => {
    history.push('/login');
  };

  // const linkUp = () => {
  //   let text = "If you want to learn more about this play click on this link!";
  //   let result = "<a href = 'https://waxfactory.nyc/productions/view/TRACES-pilot/'>" + text + "</a>";
  //   document.getElementByID("websiteLink1").innerHTML = result;
  //   return(result);
  // }
  // <script>
  // let text = "If you want to learn more about this play click on this link!";
  // let result = text.link("https://waxfactory.nyc/productions/view/TRACES-pilot/")
  // document.getElementByID("websiteLink1").innerHTML = result;
  // </script>

  return (
    <div className="container" style={{ padding: '60px', }}>
      <h2>{heading}</h2>
      <div className="grid">
        <div className='grid-col grid-col_12'>
          <img src="/bridge.jpg" alt="An image of a bridge" style={{display:'block', width: '300px', margin: '50px auto', borderRadius: '5px' }} />
        </div>
        <div className="grid-col grid-col_12">
          <p>
            Fusce porta diam ac tortor elementum, ut imperdiet metus volutpat.
            Suspendisse posuere dapibus maximus. Aliquam vitae felis libero. In
            vehicula sapien at semper ultrices. Vivamus sed feugiat libero. Sed
            sagittis neque id diam euismod, ut egestas felis ultricies. Nullam
            non fermentum mauris. Sed in enim ac turpis faucibus pretium in sit
            amet nisi.
          </p>
        </div>
      
          {/* <RegisterForm /> */}

         <div className="grid-col grid-col_12" style={{marginTop: '25px'}}></div>
            <h4>If you are participating in the play, please login.</h4>
            <Button className="btn" onClick={onLogin}>
              Login
            </Button>
        
        </div>
    
    </div>
  );
}

export default LandingPage;
