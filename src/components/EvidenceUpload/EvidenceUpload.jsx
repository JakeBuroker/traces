// * This is the actual rendering of the evidence upload functionality for the user
// ! The fileinput.onchange has to render after the fileInput has rendered.
// * Fixed the fileinput.onchange issue 
import { useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"

export default function EvidenceUpload(props) {
let [evidenceName, setEvidenceName] = useState("")
let [evidenceInfo, setEvidenceInfo] = useState("")
let [selectedFiles, setSelectedFiles] = useState([])
const dispatch = useDispatch()
// * This on change function responds to the change of the input box for evidence name, and
// * updates the useState so that it can be passed into the submit function
const changeName = (event) => {
    event.preventDefault()
    setEvidenceName(event.target.closest('input').value)
}
// * This on change function responds to the change of the textarea for evidence info, and
// * updates the useState so that it can be passed into the submit function
const changeInfo = (event) => {
    event.preventDefault()
    setEvidenceInfo(event.target.closest('textarea').value)
}
const changeFiles = (event) => {
    event.preventDefault()
    let theFiles = event.target.closest("input").files
    console.log("theFiles", theFiles, "theFiles type", typeof(theFiles));
    setSelectedFiles(theFiles[0])
    //  console.log( typeof(selectedFiles) )
}
// * Returns no input fields if the user hasn't specified an evidence type
    if (props.type == null) {
        return (
            <p>No type has been chosen</p>
        )
    }
 // * Returns input fields for submitting an image/video
    else if (props.type == "imageOrVideo") {
        let renderImage = "Image will go here"
        let renderImageSource = " "
// ? selectedFiles is established outside of the onchange function, so that the handleSubmit function
// ? can also access it
       
        
        const handleSubmit = () => {
// ? Here is where we create the payload for the axios post for visual evidence
            const formData = new FormData()
            formData.append('title', evidenceName)
            formData.append('notes', evidenceInfo)
            formData.append('file', selectedFiles)
            console.log("submitting image/video evidence");
            // console.log(renderImageSource);
            postNewEvidence(formData)
            console.log("Selected Files", selectedFiles);
            console.log("evidence Name", evidenceName);
            console.log("evidence Info", evidenceInfo);
            setSelectedFiles(" ")
            setEvidenceName(" ")
            setEvidenceInfo(" ")
        }
        const postNewEvidence = (evidence) => {
            dispatch({type:'ENTER_EVIDENCE', payload:evidence})
        }
        return (
            <div>
                <>This is where you upload images or videos</>
                <br />
                <br />
                {renderImage}
                <br/>
                <img src={renderImageSource}/>
                <br/>
                <form>
                    <label>Image/Video Name</label>
                    <input 
                    onChange={(event) => {changeName(event)}}
                    value={evidenceName}
                    />
                    <br />
                    <input 
// ? Moved the onChange to the input instead of declaring it before the input rendered
// ? to avoid errors
                    // value={selectedFiles}
                    onChange = {(event) => {changeFiles(event)}}
                    type="file" id="fileInput" multiple />
                    <br/>
                    <textarea
                    onChange={(event) => {changeInfo(event)}}
                    value={evidenceInfo}
                     placeholder="Optional Notes" />
                    <br />
                    <button onClick={handleSubmit}>Upload Evidence</button>
                </form>
            </div>
        )
    }
// * Returns the input fields for submitting text evidence
    else if (props.type == "Text") {
        const handleSubmit = () => {
            console.log("submitting text evidence");
            console.log("evidence Name", evidenceName);
            console.log("evidence Info", evidenceInfo);
            setEvidenceName(" ")
            setEvidenceInfo(" ")
// ? Here is where we create the payload for the axios post for visual evidence
            const formData = new FormData()
            formData.append('title', evidenceName)
            formData.append('notes', evidenceInfo)
            formData.append('file', selectedFiles)
            console.log("submitting image/video evidence");
            // console.log(renderImageSource);
            postNewEvidence(formData)
        }
        const postNewEvidence = (evidence) => {
            dispatch({type:'ENTER_EVIDENCE', payload:evidence})
        }
        return (
            <div>
                <>This is where you upload text</>
                <br />
                <br />
                <form>
                    <label>Text Name</label>
                    <input 
                    onChange={(event) => {changeName(event)}}
                    value={evidenceName}
                    />
                    <br />
                    
                    <br />
                    <textarea 
                    onChange={(event) => {changeInfo(event)}}
                    value={evidenceInfo}
                    placeholder="Optional Notes" />
                    <br/>
                    <button onClick={handleSubmit}>Upload Evidence</button>

                </form>
            </div>
        )
    }
// * Returns the input fields for submitting audio evidence
    else if (props.type == "Audio") {
        const handleSubmit = () => {
            console.log("submitting audio evidence");
            console.log("evidence Name", evidenceName);
            console.log("evidence Info", evidenceInfo);
            setEvidenceName(" ")
            setEvidenceInfo(" ")
        }
        return (
            <div>
                <>This is where you upload audio</>
                <br />
                <br />
                <form>
                    <label>Audio Name</label>
                    <input 
                    onChange={(event) => {changeName(event)}}
                    value={evidenceName}
                    />
                    <br />
                    <br />
                    <textarea 
                    onChange={(event) => {changeInfo(event)}}
                    value={evidenceInfo}
                    placeholder="Optional Notes" />
                     <br/>
                    <button onClick={handleSubmit}>Upload Evidence</button>

                </form>
            </div>
        )
    }
}
