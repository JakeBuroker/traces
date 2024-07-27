import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import UploadButton from "../UploadButton/UploadButton";
import { Button, Modal, Box, Typography, TextField, ThemeProvider, createTheme } from "@mui/material";
import "./UserPage.css";

// Create a theme to override MUI default styles
const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#f7f7f7', // Color of label text when the input is focused
          },
          color: '#f7f7f7',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#f7f7f7', // Change focus border color to black
          },
        },
      },
    },
  },
});

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();
  const videoRef = useRef(null);
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [userAvi, setUserAvi] = useState(null);
  const [openVideoModal, setOpenVideoModal] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [controlsEnabled, setControlsEnabled] = useState(false);

  const enableControlsAfter = 3; // Time in seconds after which the controls will be enabled

  // useEffect to check if the user has watched the video
  useEffect(() => {
    if (!user.video_watched) {
      setOpenVideoModal(true);
    }
    console.log(theme);
  }, [user.video_watched]);

  // Handle file change for avatar upload
  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  // Function to save changes to user information
  const saveChanges = async () => {
    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    if (userAvi) {
      formData.append("file", userAvi);
    }

    try {
      const response = await axios.put("/api/evidence/user", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200) {
        alert("User updated successfully.");
        setEditMode(false);
        dispatch({ type: "FETCH_USER" });
      } else {
        throw new Error("Failed to update user.");
      }
    } catch (error) {
      alert("Error updating user.");
      console.error("Error updating user:", error);
    }
  };

  // Function to mark the video as watched
  const videoWatched = async () => {
    try {
      const response = await axios.put(`/api/user/watched/${user.id}`);
      if (response.status === 200) {
        dispatch({ type: "FETCH_USER" });
        setOpenConfirmModal(false);
        history.push("/evidence");
      } else {
        throw new Error("Failed to update video watched status.");
      }
    } catch (error) {
      console.error("Error updating video watched status:", error);
    }
  };

  // Handle play/pause button for the video
  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Handle video end event
  const handleVideoEnd = () => {
    setIsPlaying(false);
    setOpenConfirmModal(true);
  };

  // Handle time update event for the video
  const handleTimeUpdate = () => {
    if (videoRef.current.currentTime >= enableControlsAfter) {
      setControlsEnabled(true);
    }
  };

  // Style for the modal
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    boxShadow: 24,
    p: 4,
  };

  // Return statement for rendering the user page
  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "70px 10px" }} className="user-container">
        {user.avatar_url ? (
          <img
            src={user.avatar_AWS_URL}
            alt="An avatar for the user."
            style={{ borderRadius: "5px" }}
          />
        ) : (
          <img
            src="./default_avi.jpeg"
            alt="The default avatar"
            style={{ borderRadius: "5px" }}
          />
        )}
        <Typography variant="h4" sx={{ textAlign: "center", padding: "10px", color: "#f7f7f7" }}>
          {user.full_name}
        </Typography>
        {editMode ? (
          <form
            className="edit-form"
            onSubmit={(e) => {
              e.preventDefault();
              saveChanges();
            }}
          >
            <TextField
              InputProps={{
                style: {
                  color: "#f7f7f7",
                },
              }}
              label="Full Name"
              variant="outlined"
              fullWidth
              margin="dense"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <TextField
              InputProps={{
                style: {
                  color: "#f7f7f7",
                },
              }}
              label="Email"
              type="email"
              variant="outlined"
              fullWidth
              margin="dense"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              InputProps={{
                style: {
                  color: "#f7f7f7",
                },
              }}
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="dense"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <UploadButton
              btnName={"Upload Avatar"}
              style={{
                marginTop: "10px",
                backgroundColor: "#c40f0f",
                color: "#f7f7f7",
              }}
              setter={setUserAvi}
              color={userAvi ? "success" : "primary"}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              style={{
                margin: "40px 0 10px 0",
                backgroundColor: "#c40f0f",
                color: "#f7f7f7",
              }}
            >
              Save Changes
            </Button>
            <Button
              onClick={() => setEditMode(false)}
              variant="contained"
              style={{ backgroundColor: "#c40f0f", color: "#f7f7f7" }}
            >
              Cancel
            </Button>
          </form>
        ) : (
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#f7f7f7",
            }}
            className="info-display"
          >
            <p>Full Name: {fullName}</p>
            <p>Email: {email}</p>
            <p>Phone Number: {phoneNumber}</p>
            <Button
              onClick={() => setEditMode(true)}
              variant="contained"
              style={{
                backgroundColor: "#c40f0f",
                color: "#f7f7f7",
              }}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => dispatch({ type: "LOGOUT" })}
              style={{
                backgroundColor: "#c40f0f",
                color: "#f7f7f7",
              }}
              variant="outlined"
            >
              Log Out
            </Button>
          </div>
        )}
        <Modal
          open={openVideoModal}
          onClose={() => {}}
          aria-labelledby="video-modal-title"
          aria-describedby="video-modal-description"
        >
          <Box sx={style}>
            <Typography id="video-modal-title" variant="h6" component="h2">
              Welcome to TRACES
            </Typography>
            <Typography id="video-modal-description" sx={{ mt: 2 }}>
              It is important that you watch the following instructional video. It covers important information about how your mobile device will be used in this experience. 
            </Typography>
            <div style={{ width: "100%", marginTop: "20px" }}>
              <video
                ref={videoRef}
                style={{ width: "100%" }}
                onEnded={handleVideoEnd}
                onTimeUpdate={handleTimeUpdate}
                controls={controlsEnabled}
              >
                <source src="https://traces-project.s3.amazonaws.com/hd0903_1080p_12000br.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!controlsEnabled && (
                <Button
                  onClick={handlePlayPause}
                  variant="contained"
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#c40f0f",
                    color: "#f7f7f7",
                  }}
                >
                  {isPlaying ? "Pause" : "Play"}
                </Button>
              )}
            </div>
          </Box>
        </Modal>
        <Modal
          open={openConfirmModal}
          onClose={() => {}}
          aria-labelledby="confirm-modal-title"
          aria-describedby="confirm-modal-description"
        >
          <Box sx={style}>
            <Typography id="confirm-modal-title" variant="h6" component="h2">
              Confirm Understanding
            </Typography>
            <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
              Do you understand the information provided in the video?
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
              <Button
                onClick={videoWatched}
                variant="contained"
                style={{
                  backgroundColor: "#c40f0f",
                  color: "hsl(0, 0%, 97%)",
                }}
              >
                Yes
              </Button>
              <Button
                onClick={() => setOpenConfirmModal(false)}
                variant="contained"
                style={{
                  backgroundColor: "#c40f0f",
                  color: "hsl(0, 0%, 97%)",
                }}
              >
                No
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default UserPage;