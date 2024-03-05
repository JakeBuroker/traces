import { combineReducers } from "redux";

const evidenceUploadReducer = (state = [], action) => {
    if(action.type === 'SET_EVIDENCE_TYPE'){
      return action.payload
    }
    return state;
  }
  
  export default combineReducers ({evidenceUploadReducer});