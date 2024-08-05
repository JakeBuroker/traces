import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* sendEmail(action){
    try{
        yield axios.post('/api/email/send', action.payload)
        yield put({ type: 'RESET_PASSWORD', payload: action.payload });
    }catch(error){
        console.error("error sending email");
    }
}
function* resetPassword(action){
    try{
        yield axios.put('/api/user/passwordupdated', [action.payload])
        console.error('action payload for password reset', action.payload);
        // yield put({ type: 'RESET_PASSWORD', payload: action.payload });
    }catch(error){
        console.error("error resetting password");
    }
}
// function* enterEmail(action){
//     try{
//         yield put ({ type })
//     }
// }


function* emailsSaga() {
    yield takeLatest('SEND', sendEmail);
    yield takeLatest('EDIT_PASSWORD', resetPassword)

  }
  
  export default emailsSaga;
  