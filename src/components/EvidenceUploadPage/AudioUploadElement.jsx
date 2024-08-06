import React, { useEffect } from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import './EvidenceUploadPage.css'

export default function AudioUploadElement(props) {
  const history = useHistory();
  const dispatch = useDispatch();
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder
  } = useAudioRecorder();

  useEffect(() => {
    if (!recordingBlob) return;
    // recordingBlob will be present at this point after 'stopRecording' has been called
  }, [recordingBlob]);

  const recorderControls = useAudioRecorder();

  // Function to handle audio recording completion
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    dispatch({ type: 'SET_MEDIA', payload: blob });
    history.push('/evidence-details');
  };

  return (
    <div>
      <AudioRecorder 
        id="audioRecorder"
        style={{ backgroundColor: "blue" }}
        onRecordingComplete={(blob) => addAudioElement(blob)}
        recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
        }}
        onNotAllowedOrFound={(err) => console.error(err)}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
      />
      <br />
    </div>
  );
}
