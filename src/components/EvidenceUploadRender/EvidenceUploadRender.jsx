// * This component will conditionally render where the user goes to to upload information to
// * the evidence table. Either photo/video, audio, or text.
import EvidenceUpload from "../EvidenceUpload/EvidenceUpload"
// import EvidenceUploadOnclick from "../EvidenceUploadOnclick/EvidenceUploadOnclick"
export default function EvidenceUploadRender() {
    const EvidenceUploadOnclick = (event) => {
        event.preventDefault()
        let uploadType = event.target.closest('button').id
        console.log("choosing evidence upload type", uploadType);
    }
    return (
        <div>
            <button id="imageOrVideo" onClick={(event) => {EvidenceUploadOnclick(event)}}>Image/Video</button>
            <br/>
            <button onClick={EvidenceUploadOnclick}>Text</button>
            <br/>
            <button onClick={EvidenceUploadOnclick}>Audio</button>

            <br/>
            <p>
                This is the component to decide which upload screen the user goes to
            </p>
        </div>
    )
}