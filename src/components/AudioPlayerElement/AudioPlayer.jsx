import { useRef, useState } from 'react';
import { tracks } from '../../Data_practice/tracks';

// import components
import DisplayTrack from './DisplayTrack';
import Controls from './Controls';
import ProgressBar from './ProgressBar';

const AudioPlayer = () => {
// ? This element may be saved until after the user uploads their content, and they're going back to
// ? review it. As a stretch we may implement it immediately after recording audio
  // console.log('here is tracks', tracks);
  // const [currentTrack, setCurrentTrack] = useState(tracks[0]);
  // const [timeProgress, setTimeProgress] = useState(0);
  // const [duration, setDuration] = useState(0);
  // const [trackIndex, setTrackIndex] = useState(0);


  // // reference
  // const audioRef = useRef();
  // const progressBarRef = useRef();

  // return (
  //   <div className="audio-player">
  //     <div className="inner">
  //       <DisplayTrack
  //         {...{ currentTrack, audioRef, setDuration, progressBarRef }}
  //       />
  //        <Controls
  //         {...{ audioRef, progressBarRef, duration, setTimeProgress,    tracks,
  //           trackIndex,
  //           setTrackIndex,
  //           setCurrentTrack, }}
  //       />
  //       <ProgressBar
  //         {...{ progressBarRef, audioRef, timeProgress, duration }}
  //       />
  //     </div>
  //   </div>
  // );
  };
  export default AudioPlayer;