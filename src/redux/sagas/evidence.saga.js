import { call, put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';


// Use call effect for making the API request
function* enterEvidence(action) {
    try {
      const response = yield call(axios.post, '/api/evidence', action.payload);
      console.log('touching server', response.data);
      yield put({ type: 'ENTER_EVIDENCE_SUCCESS', payload: response.data });
      // Dispatch fetch action to refresh the evidence list
      yield put({ type: 'FETCH_EVIDENCE' });
    } catch (error) {
      console.log('error with post request', error);
      yield put({ type: 'ENTER_EVIDENCE_FAILURE', error });
    }
  }

function* enterEvidenceSaga() {
  yield takeLatest('ENTER_EVIDENCE', enterEvidence);
}

export default enterEvidenceSaga;