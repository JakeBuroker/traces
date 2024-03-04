// * This is the actual rendering of the evidence upload functionality for the user
// ! The fileinput.onchange has to render after the fileInput has rendered.
// * Fixed the fileinput.onchange issue 
import { useState } from "react"

export default function EvidenceUpload(props) {
let [evidenceName, setEvidenceName] = useState("")
let [evidenceInfo, setEvidenceInfo] = useState("")
let [selectedFiles, setSelectedFiles] = useState([])
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
    setSelectedFiles(theFiles)
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
        const fileInput = document.getElementById("fileInput")
// ? selectedFiles is established outside of the onchange function, so that the handleSubmit function
// ? can also access it

// TODO The onchange function has to render after the fileInput renders to avoid errors.
// TODO Currently to make the image upload work correctly, the image/video button has to be clicked
// TODO With the onchange commented out, and then the onchange can be uncommented.
        // if (document?.getElementById("fileInput")?.type == "file"){
//             console.log("there's a fileinput");
//                 fileInput.onchange = () => {
//              setSelectedFiles([...fileInput.files]);
// // TODO renderImageSource currently accesses the 0 index of the selectedFiles array. Will have to cahnge to more dynamic syntax
//             //  renderImageSource = selectedFiles[0].name
//             console.log("Selected Files", selectedFiles);
//             // console.log(renderImageSource);
//         }

    
        
        const handleSubmit = () => {
            console.log("submitting image/video evidence");
            // console.log(renderImageSource);
            console.log("Selected Files", selectedFiles);
            console.log("evidence Name", evidenceName);
            console.log("evidence Info", evidenceInfo);
            setSelectedFiles(" ")
            setEvidenceName(" ")
            setEvidenceInfo(" ")
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