import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BackButton from '../BackButton/BackButton';
// Import your audio recording and playing components
import AudioUploadElement from './AudioUploadElement';
import './EvidenceUploadPage.css'

export default function EvidenceUpload() {
  const history = useHistory();
  const dispatch = useDispatch();
  const evidenceType = useSelector((store) => store.evidenceUploadReducer.evidenceUploadReducer);


  // Handle file input change for audio uploads
  const changeMedia = (event) => {
    event.preventDefault();
    const files = event.target.files; // This is a FileList object, not an array.
    const selectedFilesArray = Array.from(files); // Convert FileList to an array.
    console.log("selectedFiles", selectedFilesArray, "selectedFiles type", typeof selectedFilesArray);
    // Dispatch the action with the selected files
    dispatch({ type: 'SET_MEDIA', payload: selectedFilesArray });
    history.push('/evidence-details');
  };

const clickCamera = () => {
  console.log('clicking camera');
  document.getElementById('cameraInput').click()
}
const clickFile = () => {
  console.log('clicking camera');
  document.getElementById('fileInput').click()
}
const recordVideo = () => {
  console.log('recording video');
  document.getElementById('videoInput').click()
}
const audioClick = () => {
  console.log('clicking audio');

}



  // Render component based on the selected evidence type
  if (evidenceType == null) {
    return (
      <div>
        {/* <BackButton/> */}
        <p>No type has been chosen</p>
      </div>
    );
  } else if (evidenceType === "cambutton" || evidenceType === "notesbutton") {
    return (
      <div 
      style={{ padding: "55px" }}
      className='basicBackground'
      >
        <BackButton/>
{/* //? This input allows the user to upload a photo or video from their file directory or photo album */}
        <input
          id = "fileInput"
          className = 'fileInput'
          onChange={changeMedia} // Use the same handler for simplicity
          type="file"
          multiple
          accept='video/*, image/*'
        />
        <button
        className = 'fileButton'
        onClick= {clickFile} 
        />
        {/* <label htmlFor="cameraButton" style={{ background:"grey", padding:"5px 10px" }}>
My custom choose file label
</label> */}
{/* //? This input immediately opens the users camera and gives them the option to either take a photo ore record a video */}
        <input
        id='cameraInput'
        className= 'cameraInput'
        onChange={changeMedia}
        type="file" 
        accept="image/*" 
        capture="camera"
        />
        <input
        id='videoInput'
        className= 'videoInput'
        onChange={changeMedia}
        type="file" 
        accept="video/*" 
        capture="camera"
        />
        <button
        className = 'cameraButton'
        onClick= {clickCamera}
        />
        <button
        className='recordButton'
        onClick={recordVideo}
        />
      </div>
    );
  } else if (evidenceType === "audiobutton") {
    // For audio uploads, provide a file input and the AudioUploadElement for recording
    return (
      <div 
      style={{ padding: "55px" }}
      className = "basicBackground"
      onClick={audioClick}>
        <BackButton/>
        <input
         id = "fileInput"
          className = 'fileInput'
          onChange={changeMedia}
          type="file"
          multiple
          accept="audio/*" // Ensure only audio files can be uploaded
        />
          <button
        className = 'fileButton'
        onClick= {clickFile} 
        />
        <div className = "audioRecorderDiv">
        <AudioUploadElement 
        className="audioRecorder"/>
        </div>
      </div>
    );
  } else {
    // Fallback case if the evidence type is unrecognized
    return (
      <div>
        <p>I'm not sure what's going on</p>
      </div>
    );
  }
}