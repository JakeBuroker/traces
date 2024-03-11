// audio files
import practiceaudio from './electronic-rock-king-around-here.mp3';
import coverPhoto from './LDR_TOKEN_9.png'
import { useSelector } from 'react-redux';

// const audioReducer = useSelector(store => store.audioReducer)
// console.log('audio reducer', audioReducer);
export const tracks = [
    {
      title: 'some practice audio',
      src: practiceaudio,
      author: 'me probably',
      thumbnail: coverPhoto,
    },
    // ...
  ];

