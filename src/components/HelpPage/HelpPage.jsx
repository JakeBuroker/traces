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
          When is my investigation appointment?
        </AccordionSummary>
        <AccordionDetails>
        You should have received an email from the “Walker Art Center” confirming the date and time of your appointment. You will receive reminders via text message in the days leading up.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel2-content'
          id='panel2-header'
          sx={{textDecoration: "underline"}}
        >
          Where do I go to participate in the investigation?
        </AccordionSummary>
        <AccordionDetails>
        On the date and time of your appointment, please stand at the Northeast corner of Hennepin Avenue and South 4th Street in downtown Minneapolis (same block as Minneapolis Central Library) and await a phone call from our agency. We will call you on the number that you shared in the registration process. Do NOT go to the Walker Art Center. Nothing happens there.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3-content'
          id='panel3-header'
          sx={{textDecoration: "underline"}}
        >
          What if it’s raining or snowing? Is the operation still on?
        </AccordionSummary>
        <AccordionDetails>
        If precipitation is light, the operation will continue. Feel free to wait in the ground level lobby of Minneapolis Central Library if you are not comfortable outdoors. If the weather is severe, we will be in touch with you via text message about rescheduling your appointment.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3-content'
          id='panel3-header'
          sx={{textDecoration: "underline"}}
        >
          What do I do if the call drops?
        </AccordionSummary>
        <AccordionDetails>
        This happens from time to time. Our agency will call you back immediately. Please do not try to call us.
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls='panel3-content'
          id='panel3-header'
          sx={{textDecoration: "underline"}}
        >
          If I don’t know where to go, what do I do?
        </AccordionSummary>
        <AccordionDetails>
        One of our agents will guide you by phone every step of the way. Please follow their instructions. If anything is not clear, please let them know. They will make sure you know what to do.
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
        No. All civilian informants pay dues to TRACES Agency in the form of “tickets” purchased through the “Walker Art Center.” This makes the operation possible and keeps it discreet.
        </AccordionDetails>
      </Accordion>
      </div>

    </div>
  );
}

export default HelpPage;
