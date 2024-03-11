import { combineReducers } from "redux";

const evidenceReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_EVIDENCE':
      return action.payload;
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    case 'ENTER_EVIDENCE_SUCCESS':
      return [...state, action.payload];
    case 'ENTER_EVIDENCE_FAILURE':
      console.error(action.error);
      return state;
    default:
      return state;
  }
};

  
  export default evidenceReducer;