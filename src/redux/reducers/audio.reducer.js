import { combineReducers } from "redux";

const audioReducer = (state = [], action) => {
    if(action.type === 'SET_AUDIO'){
      return action.payload
    }
    return state;
  }
  const audioImageReducer = (state = [], action) => {
    if(action.type === 'SET_AUDIO_IMAGE'){
      return action.payload
    }
    return state;
  }
  
  export default combineReducers ({
    audioReducer,
    audioImageReducer
  });