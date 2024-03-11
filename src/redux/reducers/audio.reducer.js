import { combineReducers } from "redux";

const audioReducer = (state = [], action) => {
    if(action.type === 'SET_AUDIO'){
      return action.payload
    }
    return state;
  }
  
  export default combineReducers ({audioReducer});