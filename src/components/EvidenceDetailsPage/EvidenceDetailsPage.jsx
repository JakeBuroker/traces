import React, { useState, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Button from "@mui/material/Button";
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import { green } from '@mui/material/colors';

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

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file);
      setPreviewUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    }
  }, [file]);

  const isVideo = file?.type?.startsWith("video");
    const buttonSx = {
    ...(success && {
      bgcolor: red[500],
      "&:hover": {
        bgcolor: red[700],
      },
    }),
  };

    /** This function does a lot of things but most notably it sets the loading at the bottom of the page to start and stop once all parts of the function have been gone through and then sends the user over to the evidence page */
    const handleButtonClick = async (event) => {
      event.preventDefault();
      //Checks if loading has started yet and if the file.type is an image
      if (!loading && file?.type?.startsWith("image")) {
        setSuccess(false);
        setLoading(true);
  
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
      else if (!loading && file?.type?.startsWith("video")) {
        setSuccess(false);
        setLoading(true);
  
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
      } else if(!loading && !file) {
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
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", margin: "auto", maxWidth: "600px", padding: "20px" }}>
        <Button startIcon={<ArrowBackIosNewIcon />} onClick={()=>history.push('/evidence')} style={{ alignSelf: "flex-start", color: "black", marginBottom: "20px" }}>Back</Button>
        <h2 style={{ textAlign: "center" }}>Add Details for Your Evidence</h2>
        <form style={{ width: "100%" }}>
          {previewUrl && (
            <div style={{ textAlign: "center" }}>

              {isVideo ? (
                <video src={previewUrl} alt="Preview" controls style={{ maxWidth: "100%", height: "auto" }} />
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
              style={{ width: "100%", padding: "10px", marginBottom: "10px" }}
            />
          </div>
          <div>
            <label htmlFor="notes">Notes:</label>
            <textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              style={{ width: "100%", padding: "10px", height: "100px", marginBottom: "20px" }}
            />
          </div>
          <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            <Box sx={{ position: "relative" }}>
              <Button
                variant="contained"
                sx={{ bgcolor: loading ? green[500] : "red", "&:hover": { bgcolor: loading ? green[700] : "darkred" } }}
                disabled={loading}
                onClick={(event) => handleButtonClick(event)}
                style={{ color: "white" }}
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