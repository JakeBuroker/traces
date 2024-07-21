import React from 'react';
import './HelpPage.css';
import { Button } from '@mui/material';

function HelpPage() {
  return (
    <div style={{ padding: "50px", color: "#F7F7F7" }} className="help-page-container">
      <h2 style={{ padding: "30px" }}>Tutorial Video</h2>
      <div className="video-container">
        <video
          style={{ width: "400px", height: "2`15px" }} // Set the size of the video
          controls
        >
          <source src="https://traces-project.s3.amazonaws.com/hd0903_1080p_12000br.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 style={{ padding: "30px" }}>FAQ</h3>
      <ul>
        <li>What do I do if the call drops?</li>
        <li>If I don't know where to go, what do I do?</li>
        <li>Am I getting paid for this?</li>
      </ul>
    </div>
  );
}

export default HelpPage;
