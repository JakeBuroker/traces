import React from 'react';
import { useHistory } from 'react-router-dom';
import './HelpPage.css';
import { Button } from '@mui/material';

function HelpPage() {
  return (
    <div style={{padding:"50px"}} className="help-page-container">
      <h2 style={{padding:"30px"}} >Tutorial Video</h2>
      <div className="video-placeholder">
        {/* Placeholder content */}
        <p>Video Coming Soon!</p>
      </div>
      <Button sx={{    backgroundColor: "#c40f0f",
    color: "white",
    padding: "10px"}}>Tutorial</Button>
      <h2 style={{padding:"30px"}}>FAQ</h2>
      <ul>
        <li>What do I do if the call drops?</li>
        <li>If I don't know where to go, what do I do?</li>
        <li>Am I getting paid for this?</li>
      </ul>
    </div>
  );
}

export default HelpPage;
