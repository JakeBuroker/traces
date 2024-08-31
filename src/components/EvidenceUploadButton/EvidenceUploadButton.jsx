import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import './EvidenceUploadButton.css';

export default function EvidenceUploadButton() {
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
    const history = useHistory();
    const dispatch = useDispatch();

    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons(!showAdditionalButtons);
    };

    const handleEvidenceUpload = (event) => {
        event.preventDefault();
        const uploadType = event.target.closest('button').id;
        dispatch({ type: 'SET_EVIDENCE_TYPE', payload: uploadType });

        if (uploadType === 'notesbutton') {
            history.push('/evidence-details');
        } else {
            history.push('/evidenceupload');
        }
    };

    return (
        <div className="button-container">
            <button className="button" onClick={toggleAdditionalButtons}>
                <img className="images" src="/evidenceInputIcon.jpg" alt="Upload Evidence" />
            </button>
            {showAdditionalButtons && (
                <div className="additional-buttons">
                    <button onClick={handleEvidenceUpload} className="additional-button" id="audiobutton">
                        <img className="images" src="/recordInputIcon.jpg" alt="Audio Upload" />
                    </button>
                    <button onClick={handleEvidenceUpload} className="additional-button" id="notesbutton">
                        <img className="images" src="/notesInputIcon.jpg" alt="Notes Upload" />
                    </button>
                    <button onClick={handleEvidenceUpload} className="additional-button" id="cambutton">
                        <img className="images" src="/cameraInputIcon.jpg" alt="Camera Upload" />
                    </button>
                </div>
            )}
        </div>
    );
}
