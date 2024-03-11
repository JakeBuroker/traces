// * This is the actual rendering of the evidence upload functionality for the user
// ! The fileinput.onchange has to render after the fileInput has rendered.
// * Fixed the fileinput.onchange issue 
import { useState } from "react"
import { useDispatch } from "react-redux"
import axios from "axios"
import { useHistory } from "react-router-dom/cjs/react-router-dom.min"
import { useSelector } from "react-redux"
import AudioUploadElement from "./AudioUploadElement"
// import { Tracks as tracksfun} from "../../Data_practice/tracks"
import AudioPlayer from "../AudioPlayerElement/AudioPlayer"
export default function EvidenceUpload() {
    // console.log('tracks fun', tracksfun);
    const history = useHistory()
    const evidenceType = useSelector(store => store.evidenceUploadReducer)
    const audioBlob = useSelector(store => store.audioReducer.audioReducer)
    console.log('evidence type', evidenceType);
    console.log(evidenceType.evidenceUploadReducer);
    const actualType = evidenceType.evidenceUploadReducer
let [evidenceName, setEvidenceName] = useState("")
let [evidenceInfo, setEvidenceInfo] = useState("")
let [selectedFiles, setSelectedFiles] = useState([])
let [audioImage, setAudioImage ] = useState()
const dispatch = useDispatch()
// * This on change function responds to the change of the input box for evidence name, and
// * updates the useState so that it can be passed into the submit function
const changeName = (event) => {
    event.preventDefault()
    setEvidenceName(event.target.closest('input').value)
}
const goBack = () => {
    history.goBack()
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
const changeAudioImage = (event) => {
    event.preventDefault()
    let theFiles = event.target.closest("input").files
    console.log("this is the image for the audio", theFiles, "theFiles type", typeof(theFiles));
    setSelectedFiles(theFiles[0])
    dispatch({type:"SET_AUDIO_IMAGE", payload: theFiles})
    //  console.log( typeof(selectedFiles) )
}
// * Returns no input fields if the user hasn't specified an evidence type
    if (actualType == null) {
        return (
            <div>
                <button onClick={goBack}> Go Back</button>
            <p>No type has been chosen</p>
            </div>
        )
    }
 // * Returns input fields for submitting an image/video
    else if (actualType == "cambutton") {
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
                <button onClick={goBack}> Go Back</button>
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
    else if (actualType == "notesbutton") {
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
                <button onClick={goBack}> Go Back</button>

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
    else if (actualType == "audiobutton") {

        const handleSubmit = (event) => {
            event.preventDefault()
            console.log("submitting audio evidence");
            console.log("evidence Name", evidenceName);
            console.log("evidence Info", evidenceInfo);
            console.log("audio blob", audioBlob);
            // setEvidenceName(" ")
            // setEvidenceInfo(" ")
// ? Here is where we create the payload for the axios post for visual evidence
            const formData = new FormData()
            formData.append('title', evidenceName)
            formData.append('notes', evidenceInfo)
            formData.append('file', audioBlob)
            console.log("submitting audio evidence");
            // console.log(renderImageSource);
            postNewEvidence(formData)
        }

        const postNewEvidence = (evidence) => {
            dispatch({type:'ENTER_EVIDENCE', payload:evidence})
        }

        return (
            <div>
                <button onClick={goBack}> Go Back</button>

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
                    <button onClick={(event) => handleSubmit(event)}>Upload Evidence</button>
{/* // ? This input is going to be used to give the option to add an image to an */}
{/* // ? audio evidence input to make it easier to find on the evidence page */}
                    {/* <input 
                    onChange={(event) => changeAudioImage(event)}
                    type="file" id="fileInput" multiple /> */}
                    {/* <img src={}/> */}
                </form>
                <AudioPlayer/>

                <AudioUploadElement/>
            </div>
        )
       
    }
    else{
        return(
            <div>
                <button onClick={goBack}> Go Back</button>
                <p> I'm not sure what's going on</p>
            </div>
        )
    }
}
