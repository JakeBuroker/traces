import { combineReducers } from "redux";

const evidenceUploadReducer = (state = [], action) => {
  if(action.type === 'SET_EVIDENCE_TYPE'){
    return action.payload
  }
 if(action.type === 'ENTER_EVIDENCE_SUCCESS'){
      return [...action.payload, state]   
    }
    return state;
  }
  
  export default combineReducers ({evidenceUploadReducer});