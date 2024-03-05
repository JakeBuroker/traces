import { combineReducers } from "redux";

const evidenceReducer = (state = [], action) => {
    if(action.type === 'SET_EVIDENCE'){
      return action.payload
    }
    return state;
  }
  
  export default evidenceReducer;