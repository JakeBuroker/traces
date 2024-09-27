import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import UploadButton from "../UploadButton/UploadButton";
import { Button, Modal, Box, Typography, TextField, ThemeProvider, createTheme } from "@mui/material";
import "./UserPage.css";

const theme = createTheme({
  components: {
    MuiInputLabel: {
      styleOverrides: {
        root: {
          '&.Mui-focused': {
            color: '#000000', // Color of label text when the input is focused
          },
          color: '#000000',
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#000000',
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
  // TODO change to depending on how long the actual video is
  // Todo get the use's required selfie
  // Todo upload a public facing user avitar? (How priority?)

  useEffect(() => {
    if (!user.video_watched) {
      setOpenVideoModal(true);
    }
  }, [user.video_watched]);

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

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

  const videoWatched = async () => {
    try {
      const response = await axios.put(`/api/user/watched/${user.id}`);
      if (response.status === 200) {
        dispatch({ type: "FETCH_USER" });
        setOpenConfirmModal(false);
        history.push("/home");
      } else {
        throw new Error("Failed to update video watched status.");
      }
    } catch (error) {
      console.error("Error updating video watched status:", error);
    }
  };

  const handlePlayPause = () => {
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleVideoEnd = () => {
    setIsPlaying(false);
    setOpenConfirmModal(true);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current.currentTime >= enableControlsAfter) {
      setControlsEnabled(true);
    }
  };

  // Define the style for the modals
  const modalStyle = {
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

  return (
    <ThemeProvider theme={theme}>
      <div style={{ padding: "90px 1px" }} className="user-container">
        {user.avatar_url ? (
          <img
            src={user.avatar_AWS_URL}
            alt="An avatar for the user."
            style={{ borderRadius: "5px", border: "2px solid #000" }}
          />
        ) : (
          <img
            src="./altered_avi2.jpeg"
            alt="The default avatar"
            style={{ borderRadius: "5px", border: "2px solid #000" }}
          />
        )}
        <Typography variant="h4" sx={{ textAlign: "center", padding: "10px", color: "#000000" }}>
          {user.username}
        </Typography>
          <div
            style={{
              padding: "20px",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              color: "#000000",
              border: "2px solid #000",
              borderRadius: "8px"
            }}
            className="info-display"
          >
            <Typography variant="body1" component="label" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
              Full Name
            </Typography>
            <Typography variant="body1" component="p">
              {fullName}
            </Typography>
            <Typography variant="body1" component="label" sx={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
              Email
            </Typography>
            <Typography variant="body1" component="p">
              {email}
            </Typography>
            <Typography variant="body1" component="label" sx={{ fontWeight: 'bold', fontSize: '1.1rem', marginTop: '10px' }}>
              Phone Number
            </Typography>
            <Typography variant="body1" component="p">
              {phoneNumber}
            </Typography>
            {/* // ! If we want to upload a public facing avi soon. */}
            {/* <UploadButton
              btnName="Upload Avatar"
              style={{
                marginTop: "10px",
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "2px solid #000",
              }}
              onChange={handleFileChange}
            /> */}
            <Button
              onClick={() => dispatch({ type: "LOGOUT" })}
              variant="outlined"
              style={{
                backgroundColor: "#ffffff",
                color: "#000000",
                border: "2px solid #000",
                padding: "15px",
                alignSelf: "center",
                transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                '&:hover': {
                  backgroundColor: "#f5f5f5",
                  color: "#000000",
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                  transform: 'scale(1.02)',
                },
              }}
            >
              Log Out
            </Button>
          </div>
        <Modal
          open={openVideoModal}
          onClose={() => {}}
          aria-labelledby="video-modal-title"
          aria-describedby="video-modal-description"
        >
          <Box sx={modalStyle}>
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
                <source src="https://traces-project.s3.amazonaws.com/finaltracesonboarding.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              {!controlsEnabled && (
                <Button
                  onClick={handlePlayPause}
                  variant="contained"
                  style={{
                    marginTop: "10px",
                    backgroundColor: "#ffffff",
                    color: "#000000",
                    border: "2px solid #000",
                    transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                    '&:hover': {
                      backgroundColor: "#f5f5f5",
                      color: "#000000",
                      boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                      transform: 'scale(1.02)',
                    },
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
          <Box sx={modalStyle}>
            <Typography id="confirm-modal-title" variant="h6" component="h2">
              Video Instruction Acknowledgement
            </Typography>
            <Typography id="confirm-modal-description" sx={{ mt: 2 }}>
              Please acknowledge that you have watched and understood the instructional video. (This video can be rewatched in the 'Help' tab)
            </Typography>
            <div style={{ display: "flex", justifyContent: "space-around", marginTop: "20px" }}>
              <Button
                onClick={videoWatched}
                variant="contained"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000",
                  transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    backgroundColor: "#f5f5f5",
                    color: "#000000",
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                I understand
              </Button>
              <Button
                onClick={() => setOpenConfirmModal(false)}
                variant="contained"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#000000",
                  border: "2px solid #000",
                  transition: 'background-color 0.3s ease, transform 0.3s ease, box-shadow 0.3s ease',
                  '&:hover': {
                    backgroundColor: "#f5f5f5",
                    color: "#000000",
                    boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.2)',
                    transform: 'scale(1.02)',
                  },
                }}
              >
                Rewatch Video
              </Button>
            </div>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default UserPage;
