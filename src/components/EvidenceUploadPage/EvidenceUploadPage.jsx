import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import AudioUploadElement from "./AudioUploadElement";
import AudioPlayer from "../AudioPlayerElement/AudioPlayer";

export default function EvidenceUpload() {
  const history = useHistory();
  const evidenceType = useSelector((store) => store.evidenceUploadReducer);
  console.log("evidence type", evidenceType);
  const actualType = evidenceType.evidenceUploadReducer;
  const dispatch = useDispatch();

  const goBack = () => {
    history.goBack();
  };

  const changeFiles = (event) => {
    event.preventDefault();
    const files = event.target.files; // This is a FileList object, not an array
    const selectedFilesArray = Array.from(files); // Convert FileList to an array
    console.log("selectedFiles", selectedFilesArray, "selectedFiles type", typeof selectedFilesArray);
    dispatch({ type: 'SET_MEDIA', payload: selectedFilesArray });
    history.push('/evidence-details');
  };

  // Returns no input fields if the user hasn't specified an evidence type
  if (actualType == null) {
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <p>No type has been chosen</p>
      </div>
    );
  } else if (actualType === "cambutton") {
    // Returns input fields for submitting an image/video
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <p>This is where you upload images or videos</p>
        <br />
        <form>
          <input
            onChange={(event) => {
              changeFiles(event);
            }}
            type="file"
            id="fileInput"
            multiple
          />
          <br />
        </form>
      </div>
    ); } else if (actualType === "notesbutton") {
        // Returns input fields for submitting an image/video
        return (
          <div>
            <button onClick={goBack}>Go Back</button>
            <p>This is where you upload images or videos</p>
            <br />
            <form>
              <input
                onChange={(event) => {
                  changeFiles(event);
                }}
                type="file"
                id="fileInput"
                multiple
              />
              <br />
            </form>

          </div>
        );
      } else if (actualType == "audiobutton") {
        const handleSubmit = () => {
            console.log("submitting audio evidence");
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
              
                    />
                    <br />
                    <br />
                    <textarea 
                    onChange={(event) => {changeInfo(event)}}
                 
                    placeholder="Optional Notes" />
                     <br/>
                    <button onClick={handleSubmit}>Upload Evidence</button>
                    <input 
                    type="file" id="fileInput" multiple />
                </form>
                <AudioPlayer/>

                <AudioUploadElement/>
            </div>
        );
        
    
    
  } else {
    // Handles other types of evidence similarly or provides a fallback
    return (
      <div>
        <button onClick={goBack}>Go Back</button>
        <p>I'm not sure what's going on</p>
      </div>
    );
  }
}