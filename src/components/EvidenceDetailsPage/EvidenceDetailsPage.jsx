import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { green } from "@mui/material/colors";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import CheckIcon from "@mui/icons-material/Check";
import SaveIcon from "@mui/icons-material/Save";
import BackButton from "../BackButton/BackButton";
import './EvidenceDetailsPage.css'

export default function EvidenceDetails() {
  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [previewUrl, setPreviewUrl] = useState(""); // State to hold the preview URL
  const file = useSelector((state) => state.media[0]);
  const dispatch = useDispatch();
  const history = useHistory();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const timer = useRef();
  const blob = useSelector((store) => store.media)

useEffect(() => {
  if (file) {
    // Use the file object directly from the Redux store
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
    return () => URL.revokeObjectURL(objectUrl);
  }
}, [file]);

  const isVideo = file?.type?.startsWith("video");
    const buttonSx = {
    ...(success && {
      bgcolor: green[500],
      "&:hover": {
        bgcolor: green[700],
      },
    }),
  };

    /** This function does a lot of things but most notably it sets the loading at the bottom of the page to start and stop once all parts of the function have been gone through and then sends the user over to the evidence page */
    const handleButtonClick = async (event) => {
      console.log('submitting evidence');
      event.preventDefault();
      //Checks if loading has started yet and if the file.type is an image
      if (!loading && file?.type?.startsWith("image")) {
        setSuccess(false);
        setLoading(true);
        console.log('image');
  
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
        //when the timer runs out the button will show success, it will set loading to false and it will push the user over to the evidence page after 2 seconds
        timer.current = setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          history.push("./Evidence");
        }, 2000);
      }
      //this else statement is catching if the file.type is a video and is set to stay loading on the page for 5 seconds
      else if (!loading && file?.type?.startsWith("video/qui")) {
        setSuccess(false);
        setLoading(true);
        console.log('video');
  
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
  
        timer.current = setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          history.push("./Evidence");
        }, 5000);
      }
      else if (!loading && file?.type?.startsWith("video/webm")) {
        setSuccess(false);
        setLoading(true);
        console.log('audio');
  
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
  
        timer.current = setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          history.push("./Evidence");
        }, 5000);
      }
      else if (!loading && blob?.type?.startsWith("audio")) {
        console.log("it's a blobbb");
        setSuccess(false);
        setLoading(true);

        const formData = new FormData();
        formData.append("file", blob);
        formData.append("title", title);
        formData.append("notes", notes);
        console.log("form data", formData);

        await dispatch({
          type: "ENTER_EVIDENCE",
          payload: formData,
        });

        dispatch({
          type: "CLEAR_MEDIA",
        });

        timer.current = setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          history.push("./Evidence");
        }, 5000);

      }
       else if(!loading && !file && !blob?.type) {
        setSuccess(false);
        setLoading(true);
  
        const formData = new FormData();
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
  
        timer.current = setTimeout(() => {
          setSuccess(true);
          setLoading(false);
          history.push("./Evidence");
        }, 1000);
      }
    };

  return (
    <div className="detailsDiv">
      <BackButton/>
      <h2>Add Details for Your Evidence</h2>
      <form>
   {previewUrl && (
  <div>
    <h3>Preview:</h3>
    {file?.type.startsWith("audio") ? (
      <audio controls>
        <source src={previewUrl} type={file.type} /> {/* Use the file's type directly */}
        Your browser does not support the audio element.
      </audio>
    ) : file?.type.startsWith("video") ? (
      <video src={previewUrl} alt="Preview" controls style={{ maxWidth: "100%", height: "auto" }}></video>
    ) : (
      <img src={previewUrl} alt="Preview" style={{ maxWidth: "100%", height: "auto" }} />
    )}
  </div>
)}
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
        {/* <button type="submit">Upload Evidence</button> */}
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <Box sx={{ m: 1, position: "relative" }}>
            <Button
              variant="contained"
              sx={buttonSx}
              disabled={loading}
              type="submit"
              onClick={(event) => handleButtonClick(event)}
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