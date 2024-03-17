// * Here is where i'll make the static button for evidence upload which
// * renders the upload choices for which type of media you're uploading
import './EvidenceUploadButton.css'
import { useState, useRef } from 'react';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import { useDispatch } from 'react-redux';

export default function EvidenceUploadButton () {
    const dispatch = useDispatch()
    const history = useHistory()
    let [evidenceType, setEvidenceType] = useState()
const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);

// const mainButtonRef= useRef(null)
const EvidenceUploadOnclick = (event) => {
    event.preventDefault()
    let uploadType = event.target.closest('button').id
    console.log("choosing evidence upload type", uploadType);
    setEvidenceType(uploadType)
    dispatch({type:'SET_EVIDENCE_TYPE', payload:uploadType})
    history.push('/evidenceupload')
}

const EvidenceDetails = (event) => {
  event.preventDefault()
  let uploadType = event.target.closest('button').id
  console.log("choosing evidence upload type", uploadType);
  setEvidenceType(uploadType)
  dispatch({type:'SET_EVIDENCE_TYPE', payload:uploadType})
  history.push('/evidence-details')
}

const toggleAdditionalButtons = () => {
  setShowAdditionalButtons(!showAdditionalButtons);
};

return (
  <div className='button-container'>
    <button 
    className="button" onClick={toggleAdditionalButtons}><img className='images' src="/evidenceInputIcon.jpg"/></button>

    {showAdditionalButtons && (
      <div >
        <button onClick = {EvidenceUploadOnclick} className="additional-button" id="cambutton"><img className='images' src="/cameraInputIcon.jpg"/></button>
        <button onClick = {EvidenceUploadOnclick} className="additional-button" id="audiobutton"><img className='images' src="/recordInputIcon.jpg"/></button>
        <button onClick = {EvidenceDetails} className="additional-button" id="notesbutton"><img className='images' src="/notesInputIcon.jpg"/></button>
      </div>
    )}
  </div>
);
}





