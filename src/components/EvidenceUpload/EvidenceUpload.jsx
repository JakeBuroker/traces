// * This is the actual rendering of the evidence upload functionality for the user
// ! The fileinput.onchange has to render after the fileInput has rendered.

export default function EvidenceUpload(props) {

    if (props.type == undefined) {
        return (
            <p>No type has been chosen</p>
        )
    }
    else if (props.type == "imageOrVideo") {
        const fileInput = document.getElementById("fileInput")
// ? selectedFiles is established outside of the onchange function, so that the handleSubmit function
// ? can also access it
        let selectedFiles = ""
// TODO The onchange function has to render after the fileInput renders to avoid errors.
// TODO Currently to make the image upload work correctly, the image/video button has to be clicked
// TODO With the onchange commented out, and then the onchange can be uncommented.
        fileInput.onchange = () => {
             selectedFiles = [...fileInput.files];
            console.log(selectedFiles);
        }
        const handleSubmit = () => {
            console.log("submitting evidence");
            console.log(selectedFiles);
        }
        return (
            <div>
                <>This is where you upload images or videos</>
                <br />
                <> This is the evidence type: {props.type}</>
                <br />
                <form>
                    <label>Image/Video Name</label>
                    <input />
                    <br />
                    <input type="file" id="fileInput" multiple />
                    <br />
                    <button onClick={handleSubmit}>Upload Evidence</button>
                    <br/>
                    <textarea placeholder="Optional Notes" />
                </form>
            </div>
        )
    }
    else if (props.type == "Text") {
        return (
            <div>
                <>This is where you upload images or videos</>
                <br />
                <> This is the evidence type: {props.type}</>
                <br />
                <form>
                    <label>Text Name</label>
                    <input />
                    <br />
                    
                    <br />
                    <textarea placeholder="Optional Notes" />
                </form>
            </div>
        )
    }
    else if (props.type == "Audio") {
        return (
            <div>
                <>This is where you upload images or videos</>
                <br />
                <> This is the evidence type: {props.type}</>
                <br />
                <form>
                    <label>Audio Name</label>
                    <input />
                    <br />
                    <br />
                    <textarea placeholder="Optional Notes" />
                </form>
            </div>
        )
    }
}