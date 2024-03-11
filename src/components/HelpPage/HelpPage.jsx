import { Padding } from '@mui/icons-material';
import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

function HelpPage(){
    return(
        <div style={{padding: "55px"}}>
            <h2>Tutorial Video</h2>
            <p>this is where the tutorial video would be</p>
            <button>Tutorial</button>
            <h2>FAQ</h2>
            <ul>
                <li>What do I do if the call drops?</li>
                <li>If i don't know where to go what do I do?</li>
                <li>Am I getting paid for this?</li>
            </ul>
        </div>
    )
}
export default HelpPage;