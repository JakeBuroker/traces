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
  const acceptedImageTypes = ["image/png", "image/jpeg", "image/gif", "image/heif", "image/webp"];

  useEffect(() => {
    if (file) {
      const objectUrl = URL.createObjectURL(file); // Create an object URL for the file
      setPreviewUrl(objectUrl);
      // Clean up the object URL on component unmount
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
      event.preventDefault();
      //Checks if loading has started yet and if the file.type is an image
      if (!loading && acceptedImageTypes.includes(file.type)) {
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
      else if (!loading && file.type === "video/quicktime") {
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
      }
    };

  // const handleSubmit = async (event) => {
  //   event.preventDefault();
  //   const formData = new FormData();
  //   formData.append("file", file);
  //   formData.append("title", title);
  //   formData.append("notes", notes);

  //   // Assuming ENTER_EVIDENCE action returns a promise
  //   await dispatch({
  //     type: "ENTER_EVIDENCE",
  //     payload: formData,
  //   });

  //   // Optionally, dispatch any cleanup actions
  //   dispatch({
  //     type: "CLEAR_MEDIA",
  //   });

  //   // Navigate after the action is complete and the state is updated
  //   history.push('./Evidence');
  // };

  return (
    <div>
      <h2>Add Details for Your Evidence</h2>
      <form>
        {previewUrl && (
          <div>
            <h3>Preview:</h3>
            {isVideo ? (
              <iframe src={previewUrl} alt="Preview" controls style={{ maxWidth: "100%", height: "auto" }} />
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
            <Fab
              aria-label="save"
              color="primary"
              sx={buttonSx}
              type="submit"
              onClick={(event) => handleButtonClick(event)}
            >
              {success ? <CheckIcon /> : <SaveIcon />}
            </Fab>
            {loading && (
              <CircularProgress
                size={68}
                sx={{
                  color: green[500],
                  position: "absolute",
                  top: -6,
                  left: -6,
                  zIndex: 1,
                }}
              />
            )}
          </Box>
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
