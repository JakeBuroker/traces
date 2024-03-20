// Component responsible for deciding where the user goes to upload information to the evidence table,
// either photo/video, audio, or text.

// Import statements
import EvidenceUpload from "../EvidenceUpload/EvidenceUpload"; // Importing the EvidenceUpload component
import { useState } from "react"; // Importing useState hook for state management

// Functional component definition
export default function EvidenceUploadRender() {
    // State variable to store the evidence type
    const [evidenceType, setEvidenceType] = useState();

    // Function to handle click on buttons to select evidence type
    const handleEvidenceTypeSelection = (event) => {
        event.preventDefault(); // Preventing default behavior of the button
        const uploadType = event.target.closest('button').id; // Getting the ID of the clicked button
        setEvidenceType(uploadType); // Setting the evidence type state variable
    };

    // JSX return
    return (
        <div>
            {/* Buttons to select evidence type */}
            <button id="imageOrVideo" onClick={handleEvidenceTypeSelection}>Image/Video</button>
            <br/>
            <button id="Text" onClick={handleEvidenceTypeSelection}>Text</button>
            <br/>
            <button id="Audio" onClick={handleEvidenceTypeSelection}>Audio</button>
            <br/>
            {/* Rendering the EvidenceUpload component with the selected evidence type */}
            <EvidenceUpload type={evidenceType}/>
            <br/>
            {/* Placeholder text */}
            <p>
                This is the component to decide which upload screen the user goes to
            </p>
        </div>
    )
}