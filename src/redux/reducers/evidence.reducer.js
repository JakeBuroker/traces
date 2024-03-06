import { combineReducers } from "redux";

const evidenceReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_EVIDENCE':
      return action.payload;
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    default:
      return state;
  }
};

  
  
  export default evidenceReducer;