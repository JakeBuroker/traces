import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

// Custom components for audio uploading and playing functionalities.
import AudioUploadElement from "./AudioUploadElement";
import AudioPlayer from "../AudioPlayerElement/AudioPlayer";

export default function EvidenceUpload() {
  const history = useHistory();
  const evidenceType = useSelector((store) => store.evidenceUploadReducer);
  const actualType = evidenceType.evidenceUploadReducer;
  const dispatch = useDispatch();
  

  // Function to navigate back to the previous page.
  const goBack = () => {
    history.goBack();
  };

  // Handler for file input change event. Dispatches an action with selected files and navigates to '/evidence-details'.
  const changeFiles = (event) => {
    event.preventDefault();
    const files = event.target.files; // This is a FileList object, not an array.
    const selectedFilesArray = Array.from(files); // Convert FileList to an array.
    console.log("selectedFiles", selectedFilesArray, "selectedFiles type", typeof selectedFilesArray);
    dispatch({ type: 'SET_MEDIA', payload: selectedFilesArray });
    history.push('/evidence-details'); 
  };

  // Conditional rendering based on the selected evidence type.
  if (actualType == null) {
    // If no evidence type is selected, prompt the user to go back and select a type.
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <p>No type has been chosen</p>
      </div>
    );
  } else if (actualType === "cambutton" || actualType === "notesbutton") {
    // For image or video uploads, display a file input.
    return (
      <div style={{ padding:"55px" }}>
        <button onClick={goBack}>Go Back</button>
        <p>This is where you upload images or videos</p>
        <form>
        <input
  onChange={changeFiles}
  type="file"
  id="fileInput"
  multiple
  accept="image/png, image/jpeg" // This line restricts the file input to PNG and JPEG images only
/>
        </form>
      </div>
    );
  } else if (actualType == "audiobutton") {
    // For audio uploads, provide additional inputs for audio name and optional notes.
    const handleSubmit = (event) => {
      console.log("submitting audio evidence", files);
    }
    return (
        <div style={{ padding:"55px" }}>
            <button onClick={goBack}> Go Back</button>
            <p>This is where you upload audio</p>
            <form>
                {/* Input for audio name and notes not fully implemented. */}
            <input
            onChange={(event) => {
              changeFiles(event);
            }}
            type="file"
            id="fileInput"
            multiple
            
            />
            </form>
            <AudioPlayer/>
            <AudioUploadElement/>
        </div>
    );
  } else {
    // Fallback case if the evidence type is unrecognized.
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <p>I'm not sure what's going on</p>
      </div>
    );
  }
}