import React from 'react';
import { useHistory } from 'react-router-dom';
import './HelpPage.css';
import { Button } from '@mui/material';

function HelpPage() {
  const history = useHistory();


  return (
    <div style={{padding: "50px"}} className="help-page-container">
      <h2 style={{padding: "30px"}}>Tutorial Video</h2>
      <div className="video-placeholder">
        <figure>
          <figcaption>Video Coming Soon!</figcaption>
          {/* You might want to include an engaging placeholder image here */}
        </figure>
      </div>
      <Button sx={{backgroundColor: "#c40f0f", color: "hsl(0, 0%, 97%)", padding: "10px"}} onClick={() =>   history.push('/evidence')}>
        Tutorial
      </Button>
      <h2 style={{padding: "30px"}}>FAQ</h2>
      <ul>
        <li>What do I do if the call drops?</li>
        <li>If I don't know where to go, what do I do?</li>
        <li>Am I getting paid for this?</li>
      </ul>
    </div>
  );
}

export default HelpPage;
