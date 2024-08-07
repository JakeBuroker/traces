import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import './EvidenceDetailsPage.css'; // Ensure this CSS file contains your desired styles
import { green, red } from "@mui/material/colors";

export default function EvidenceDetails() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const file = useSelector((state) => state.media[0]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const blob = useSelector((store) => store.media);

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const handleButtonClick = async (event) => {
    event.preventDefault();
    if (!loading) {
      setSuccess(false);
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file || blob);
      formData.append("title", title);
      formData.append("notes", notes);

      await dispatch({
        type: "ENTER_EVIDENCE",
        payload: formData,
      });

      dispatch({ type: "CLEAR_MEDIA" });

      timer.current = setTimeout(() => {
        setSuccess(true);
        setLoading(false);
        history.push("./Evidence");
      }, 2000); // Adjust time as needed based on the file type
    }
  };

  return (
    <div className="detailsDiv" style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", maxWidth: "600px" }}>
      <Button
        startIcon={<ArrowBackIosNewIcon />}
         className="back-button"
        onClick={() => history.push('/evidence')}
        style={{ position: 'absolute', top: '20px', left: '20px', color: "black", marginBottom: "20px" }}
      >
        Back
      </Button>
      <h2 style={{ textAlign: "center" }}>Add Details for Your Evidence</h2>
      <form onSubmit={handleButtonClick} style={{ width: "100%" }}>
        {previewUrl && (
          <div style={{ textAlign: "center", marginBottom: "20px", maxWidth: "600px", margin: "auto" }}>
            {file?.type.startsWith("audio") ? (
              <audio controls style={{ width: "100%" }}>
                <source src={previewUrl} type={file.type} />
                Your browser does not support the audio element.
              </audio>
            ) : file?.type.startsWith("video") ? (
              <video src={previewUrl} alt="Preview" controls style={{ width: "100%", maxHeight: "500px" }} />
            ) : (
              <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", maxHeight: "500px", height: "auto" }} />
            )}
          </div>
        )}
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            style={{ width: "100%", padding: "10px" }}
          />
        </div>
        <div style={{ marginBottom: "20px" }}>
          <label htmlFor="notes">Notes:</label>
          <textarea
            id="notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            style={{ width: "100%", padding: "10px", height: "100px" }}
          />
        </div>
        <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          <Box sx={{ position: "relative" }}>
            <Button
              variant="contained"
              sx={{ bgcolor: red[500], "&:hover": { bgcolor: red[700] }, color: 'white' }}
              disabled={loading}
              type="submit"
            >
              Upload Evidence
            </Button>
            {loading && (
              <CircularProgress
                size={24}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  marginTop: "-12px",
                  marginLeft: "-12px",
                }}
              />
            )}
          </Box>
        </Box>
      </form>
    </div>
  );
}
