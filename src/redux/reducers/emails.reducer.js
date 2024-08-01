import { combineReducers } from "redux";

const emailReducer = (state = "", action) => {
  if (action.type === 'RESET_PASSWORD') {
    return action.payload
  }
  return state;
}





export default combineReducers({
  emailReducer,
});