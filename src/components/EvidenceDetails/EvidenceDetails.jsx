import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";

export default function EvidenceDetails() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // State to hold the image preview URL
  const file = useSelector((state) => state.media[0]);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Create an object URL for the file
      setPreviewUrl(objectUrl);
      // Clean up the object URL on component unmount
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  

const handleSubmit = async (event) => {
  event.preventDefault();
  const formData = new FormData();
  formData.append("file", file);
  formData.append("title", title);
  formData.append("notes", notes);

  // Assuming ENTER_EVIDENCE action returns a promise
  await dispatch({
    type: "ENTER_EVIDENCE",
    payload: formData,
  });

  // Optionally, dispatch any cleanup actions
  dispatch({
    type: "CLEAR_MEDIA",
  });

  // Navigate after the action is complete and the state is updated
  history.push('./Evidence');
};

  return (
    <div>
      <h2>Add Details for Your Evidence</h2>
      {previewUrl && ( // Render the image preview if the URL is available
        <div>
          <h3>Preview:</h3>
          <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
        </div>
      )}
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
