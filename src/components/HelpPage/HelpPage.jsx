import React from 'react';
import './HelpPage.css';
import { Button } from '@mui/material';
import Accordion from '@mui/material/Accordion';
import AccordionActions from '@mui/material/AccordionActions';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function HelpPage() {
  return (
    <div style={{ padding: "66px", color: "#000000" }} className="help-page-container">
      <h2 style={{ padding: "15px" }}>Tutorial Video</h2>
      <div className="video-container">
        <video
          style={{ width: "350px", height: "2`15px" }} // Set the size of the video
          controls
        >
          <source src="https://traces-project.s3.amazonaws.com/hd0903_1080p_12000br.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      <h3 style={{ padding: "20px" }}>FAQ</h3>
      <div style={{backgroundColor:"f7f7f7"}}>
        <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel1-content'
          id='panel1-header'
          sx={{textDecoration: "underline"}}
        >
          What do I do if the call drops?
        </AccordionSummary>
        <AccordionDetails>
          Call the number back or move to an area where your phone has reception and then attempt to call back.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
          sx={{textDecoration: "underline"}}
        >
          If I don't know where to go, what do I do?
        </AccordionSummary>
        <AccordionDetails>
          Await further instruction from the prompter.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3-content'
          id='panel3-header'
          sx={{textDecoration: "underline"}}
        >
          Am I getting paid for this?
        </AccordionSummary>
        <AccordionDetails>
          As much as we would love to we cant.
        </AccordionDetails>
      </Accordion>
      </div>

    </div>
  );
}

export default HelpPage;
