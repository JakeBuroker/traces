// Component for the evidence upload button, which renders the upload choices for different media types

// Import statements
import './EvidenceUploadButton.css';
import { useState } from 'react'; // Importing useState hook for state management
import { useHistory } from 'react-router-dom'; // Importing useHistory for programmatic navigation
import { useDispatch } from 'react-redux'; // Importing useDispatch for dispatching actions

// Functional component definition
export default function EvidenceUploadButton() {
    // State variables
    const [showAdditionalButtons, setShowAdditionalButtons] = useState(false); // State variable to control the visibility of additional buttons
    const history = useHistory(); // History instance for navigation
    const dispatch = useDispatch(); // Dispatch function to dispatch actions
    const [evidenceType, setEvidenceType] = useState(); // State variable to store the selected evidence type

    // Function to handle click on main evidence upload button
    const toggleAdditionalButtons = () => {
        setShowAdditionalButtons(!showAdditionalButtons); // Toggling the visibility of additional buttons
    };

    // Function to handle click on additional buttons for different evidence types
    const handleEvidenceUpload = (event) => {
        event.preventDefault(); // Preventing default behavior of the button
        const uploadType = event.target.closest('button').id; // Getting the ID of the clicked button
        setEvidenceType(uploadType); // Setting the evidence type state variable
        dispatch({ type: 'SET_EVIDENCE_TYPE', payload: uploadType }); // Dispatching an action to store the evidence type in Redux state
        history.push('/evidenceupload'); // Navigating to the evidence upload page
    };

    const handleNotesUpload = (event) => {
        event.preventDefault(); // Preventing default behavior of the button
        setEvidenceType(1); // Setting the evidence type state variable
        dispatch({ type: 'SET_EVIDENCE_TYPE', payload: 1 }); // Dispatching an action to store the evidence type in Redux state
        history.push('/evidence-details'); // Navigating to the evidence upload page
    };

    // JSX return
    return (
        <div className='button-container'>
            {/* Main evidence upload button */}
            <button className="button" onClick={toggleAdditionalButtons}>
                <img className='images' src="/evidenceInputIcon.jpg" alt="Upload Evidence" />
            </button>

            {/* Additional buttons for different evidence types */}
            {showAdditionalButtons && (
                <div>
                    {/* Button for camera uploads */}
                    <button onClick={handleEvidenceUpload} className="additional-button" id="cambutton">
                        <img className='images' src="/cameraInputIcon.jpg" alt="Camera Upload" />
                    </button>
                    {/* Button for audio uploads */}
                    <button onClick={handleEvidenceUpload} className="additional-button" id="audiobutton">
                        <img className='images' src="/recordInputIcon.jpg" alt="Audio Upload" />
                    </button>
                    {/* Button for notes uploads */}
                    <button onClick={handleNotesUpload} className="additional-button" id="notesbutton">
                        <img className='images' src="/notesInputIcon.jpg" alt="Notes Upload" />
                    </button>
                </div>
            )}
        </div>
    );
}