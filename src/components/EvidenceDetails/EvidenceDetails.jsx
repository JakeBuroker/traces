import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function EvidenceDetails() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const file = useSelector((state) => state.media[0]);
  const dispatch = useDispatch();
  console.log(file);
  const history = useHistory();

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      console.error("No file selected.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("title", title);
    formData.append("notes", notes);

    dispatch({
      type: "ENTER_EVIDENCE",
      payload: formData,
    });
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
        <div>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>
        <button type="submit">Upload Evidence</button>
      </form>
    </div>
  );
}
