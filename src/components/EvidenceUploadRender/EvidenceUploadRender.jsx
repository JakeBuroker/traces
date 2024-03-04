// * This component will conditionally render where the user goes to to upload information to
// * the evidence table. Either photo/video, audio, or text.
import EvidenceUpload from "../EvidenceUpload/EvidenceUpload"
import { useState } from "react"
// import EvidenceUploadOnclick from "../EvidenceUploadOnclick/EvidenceUploadOnclick"
export default function EvidenceUploadRender() {
    // let evidenceType = "noType"
// Using useState() to store the evidence type locally and pass to EvidenceUpload for conditional rendering
    let [evidenceType, setEvidenceType] = useState()
    const EvidenceUploadOnclick = (event) => {
        event.preventDefault()
        let uploadType = event.target.closest('button').id
        console.log("choosing evidence upload type", uploadType);
        setEvidenceType(uploadType)
       
    }
    return (
        <div>
            <button id="imageOrVideo" onClick={(event) => {EvidenceUploadOnclick(event)}}>Image/Video</button>
            <br/>
            <button id="Text" onClick={EvidenceUploadOnclick}>Text</button>
            <br/>
            <button id="Audio" onClick={EvidenceUploadOnclick}>Audio</button>
            <br/>
            <EvidenceUpload
            type = {evidenceType}/>
            <br/>
            <p>
                This is the component to decide which upload screen the user goes to
            </p>
        </div>
    )
}