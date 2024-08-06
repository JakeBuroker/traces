import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import BackButton from '../BackButton/BackButton';
import AudioUploadElement from './AudioUploadElement';
import './EvidenceUploadPage.css'

export default function EvidenceUpload() {
  const history = useHistory();
  const dispatch = useDispatch();
  const evidenceType = useSelector((store) => store.evidenceUploadReducer.evidenceUploadReducer);

  // Handle file input change for audio uploads
  const changeMedia = (event) => {
    event.preventDefault();
    const files = event.target.files;
    const selectedFilesArray = Array.from(files);
    dispatch({ type: 'SET_MEDIA', payload: selectedFilesArray });
    history.push('/evidence-details');
  };

  const clickCamera = () => {
    document.getElementById('cameraInput').click();
  }

  const clickFile = () => {
    document.getElementById('fileInput').click();
  }

  const recordVideo = () => {
    document.getElementById('videoInput').click();
  }

  const audioClick = () => {
    // Placeholder for audio click event
  }

  // Render component based on the selected evidence type
  if (evidenceType == null) {
    return (
      <div>
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
        <input
          id="fileInput"
          className='fileInput'
          onChange={changeMedia}
          type="file"
          multiple
          accept='video/*, image/*'
        />
        <button
          className='fileButton'
          onClick={clickFile} 
        />
        <input
          id='cameraInput'
          className='cameraInput'
          onChange={changeMedia}
          type="file" 
          accept="image/*" 
          capture="camera"
        />
        <input
          id='videoInput'
          className='videoInput'
          onChange={changeMedia}
          type="file" 
          accept="video/*" 
          capture="camera"
        />
        <button
          className='cameraButton'
          onClick={clickCamera}
        />
        <button
          className='recordButton'
          onClick={recordVideo}
        />
      </div>
    );
  } else if (evidenceType === "audiobutton") {
    return (
      <div 
        style={{ padding: "55px" }}
        className='basicBackground'
        onClick={audioClick}
      >
        <BackButton/>
        <input
          id="fileInput"
          className='fileInput'
          onChange={changeMedia}
          type="file"
          multiple
          accept="audio/*"
        />
        <button
          className='fileButton'
          onClick={clickFile}
        />
        <div className='audioRecorderDiv'>
          <AudioUploadElement className="audioRecorder"/>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        <p>I'm not sure what's going on</p>
      </div>
    );
  }
}
