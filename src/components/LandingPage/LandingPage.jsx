import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
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
    <div className="container">
      <h2>{heading}</h2>

      <div className="grid">
        <div className="grid-col grid-col_8">
          <p>
          This project involves participants who are equipped with synchronized audio devices, following a narrator's prompts to track the journey of an individual (an actor) as she moves through various real public locations across the city. Participants are instructed to document their observations through audio, video, and photo recordings.
          </p>

          <p id="websiteLink1">
          </p>
         
          <p>
            Fusce porta diam ac tortor elementum, ut imperdiet metus volutpat.
            Suspendisse posuere dapibus maximus. Aliquam vitae felis libero. In
            vehicula sapien at semper ultrices. Vivamus sed feugiat libero. Sed
            sagittis neque id diam euismod, ut egestas felis ultricies. Nullam
            non fermentum mauris. Sed in enim ac turpis faucibus pretium in sit
            amet nisi.
          </p>
        </div>
        <div className="grid-col grid-col_4">
          <RegisterForm />

          <center>
            <h4>If you are participating in the play please login.</h4>
            <button className="btn btn_sizeSm" onClick={onLogin}>
              Login
            </button>
          </center>
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
