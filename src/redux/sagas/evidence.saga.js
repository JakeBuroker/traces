import { takeLatest } from "redux-saga/effects";
import axios from "axios";

function* enterEvidence (action) {
    console.log('entering visual evidence with a saga', action.payload);
  
    axios.post('/api/evidence', action.payload).then(() => {
       console.log('touching server');
    })
    .catch(error => {
        console.log('error with post request', error);
    });
}

    function* enterEvidenceSaga() {
        yield takeLatest ('ENTER_EVIDENCE', enterEvidence);
        // yield takeLatest ('SET_CHAR_LEVEL', characterLevel)
     
    }
    
    
    
    export default enterEvidenceSaga;