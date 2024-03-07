import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function EvidenceDetails() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const file = useSelector((state) => state.media[0]); // Assuming first selected file for simplicity
  const evidenceType = useSelector((state) => state.evidenceUploadReducer.evidenceUploadReducer); // Adjust based on your store
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Form data is created regardless, but filled conditionally
    const formData = new FormData();
    
    if (evidenceType !== 'notesbutton') {
      // Only append file if not submitting notes-only evidence
      if (!file) {
        console.error("No file selected.");
        return;
      }
      formData.append("file", file);
    }

    formData.append("title", title);
    formData.append("notes", notes);

    dispatch({
      type: "ENTER_EVIDENCE",
      payload: formData,
    });

    // Navigate after dispatch
    history.push('/upload-success');
  };

  return (
    <div>
      <h2>Add Details for Your Evidence</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        {/* Conditionally render notes input only for notes evidence type */}
        {evidenceType === 'notesbutton' && (
          <div>
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
        )}
        <button type="submit">Upload Evidence</button>
      </form>
    </div>
  );
}
