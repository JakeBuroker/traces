import { combineReducers } from "redux";

const evidenceReducer = (state = [], action) => {
  switch (action.type) {
    case 'SET_EVIDENCE':
      return action.payload;
    case 'REMOVE':
      return state.filter(item => item.id !== action.payload);
    case 'ENTER_EVIDENCE_SUCCESS':
      // Assuming the payload is the new evidence item
      return [...state, action.payload];
    case 'ENTER_EVIDENCE_FAILURE':
      // Handle failure (this is more of a placeholder as you might not update the state)
      console.error(action.error);
      return state;
    default:
      return state;
  }
};

  
  export default evidenceReducer;