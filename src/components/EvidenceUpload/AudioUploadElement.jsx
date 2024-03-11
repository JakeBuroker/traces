import * as React from 'react';
import { AudioRecorder, useAudioRecorder } from 'react-audio-voice-recorder';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

export default function AudioUploadElement() {
  const dispatch = useDispatch()
  // navigator.mediaDevices
  // .getUserMedia(audio)
  // .then((stream) => {
  //   /* use the stream */
  // })
  // .catch((err) => {
  //   /* handle the error */
  // });
  //   getUserMedia()
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
  }, [recordingBlob])

  const recorderControls = useAudioRecorder()
  const addAudioElement = (blob, Blob) => {
    console.log('blob', blob);
    // console.log('Blob', Blob);
    const url = URL.createObjectURL(blob);
    const audio = document.createElement('audio');
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
    console.log('audio source', audio.src);
    dispatch({type:'SET_AUDIO', payload: blob})
  };

  const finishRecording = (blob) => {

    console.log('blob', blob);
  }

  return(
    <div>

      <AudioRecorder onClick={console.log('clicking audio record')}
         onRecordingComplete={(blob) => addAudioElement(blob)}
         recorderControls={recorderControls}
        audioTrackConstraints={{
          noiseSuppression: true,
          echoCancellation: true,
          // autoGainControl,
          // channelCount,
          // deviceId,
          // groupId,
          // sampleRate,
          // sampleSize,
        }}
        onNotAllowedOrFound={(err) => console.table(err)}
        downloadOnSavePress={true}
        downloadFileExtension="webm"
        mediaRecorderOptions={{
          audioBitsPerSecond: 128000,
        }}
        // showVisualizer={true}
      />
      <br />
    </div>
  );
}