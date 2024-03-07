const initialState = []; // Start with an empty array

const mediaReducer = (state = initialState, action) => {
  switch (action.type) {
    case "SET_MEDIA":
      return action.payload; // Payload is now an array of files
    default:
      return state;
  }
};

export default mediaReducer;
