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
    className="button" onClick={toggleAdditionalButtons}>📕</button>

    {showAdditionalButtons && (
      <div >
        <button onClick = {EvidenceUploadOnclick} className="additional-button" id="cambutton">📸</button>
        <button onClick = {EvidenceUploadOnclick} className="additional-button" id="audiobutton">🎤</button>
        <button onClick = {EvidenceDetails} className="additional-button" id="notesbutton">📝</button>
      </div>
    )}
  </div>
);
}





// import './EvidenceUploadButton.css';
// import { useState, useEffect, useRef } from 'react';

// export default function EvidenceUploadButton() {
//   const [showAdditionalButtons, setShowAdditionalButtons] = useState(false);
//   const mainButtonRef = useRef(null); // React ref for the main button
//   const [additionalButtonsStyle, setAdditionalButtonsStyle] = useState({});

//   useEffect(() => {
//     if (showAdditionalButtons && mainButtonRef.current) {
//       const mainButton = mainButtonRef.current.getBoundingClientRect();
//       // Dynamically calculate positions for additional buttons
//       const style = {
//         cambutton: {
//           position: 'fixed',
//           top: `${mainButton.top - 50}px`, // Example position adjustment
//           left: `${mainButton.left + 50}px`,
//         },
//         audiobutton: {
//           position: 'fixed',
//           top: `${mainButton.top}px`,
//           left: `${mainButton.left - 100}px`,
//         },
//         notesbutton: {
//           position: 'fixed',
//           top: `${mainButton.top + 50}px`,
//           left: `${mainButton.left + 50}px`,
//         },
//       };
//       setAdditionalButtonsStyle(style);
//     }
//   }, [showAdditionalButtons]); // Recalculate when the visibility of additional buttons changes

//   const toggleAdditionalButtons = () => {
//     setShowAdditionalButtons(!showAdditionalButtons);
//   };

//   return (
//     <div className='button-container'>
//       <button
//         ref={mainButtonRef}
//         className="button"
//         onClick={toggleAdditionalButtons}
//       >
//         :closed_book:
//       </button>
//       {showAdditionalButtons && (
//         <div className='additional-buttons-container'>
//           <button style={additionalButtonsStyle.cambutton} className="additional-button" id="cambutton">:camera_with_flash:</button>
//           <button style={additionalButtonsStyle.audiobutton} className="additional-button" id="audiobutton">:microphone:</button>
//           <button style={additionalButtonsStyle.notesbutton} className="additional-button" id="notesbutton">:memo:</button>
//         </div>
//       )}
//     </div>
//   );
// }