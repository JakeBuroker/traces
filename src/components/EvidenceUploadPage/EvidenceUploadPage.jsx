import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';
import Button from '@mui/material/Button';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
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
        style={{ marginTop: "85px",}}
        className='basicBackground'
      >
        <Button
         className="back-button"
         title='Back Button'
          startIcon={<ArrowBackIosNewIcon />}
          onClick={() => history.push('/evidence')}
          style={{ alignSelf: "flex-start", color: "black", marginTop: "-35px", left: "-0px" }}
        >
          Back
        </Button>
        <input
          id="fileInput"
          className='fileInput'
          onChange={changeMedia}
          type="file"
          // multiple
          accept='video/*, image/*'
        />
        <button
          className='fileButton'
          onClick={clickFile}
          title='Upload File' 
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
          title='Take Picture'
        />
        <button
          className='recordButton'
          onClick={recordVideo}
          title='Record Video'
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
        <Button
          startIcon={<ArrowBackIosNewIcon />}
          title='Back Button'
          onClick={() => history.push('/evidence')}
          style={{ alignSelf: "flex-start", color: "black", marginTop: "25px", left: "-50px" }}
        >
          Back
        </Button>
        <input
          id="fileInput"
          className='fileInput'
          onChange={changeMedia}
          type="file"
          // multiple
          accept="audio/*"
        />
        <button
          className='fileButton'
          title='Record Audio'
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
