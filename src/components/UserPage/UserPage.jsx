import React, { useState, useEffect } from "react";
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
          // Default label color
          '&.Mui-focused': {
            color: 'black', // Color of label text when the input is focused
          }
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: 'black', // Change focus border color to black
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
  const [editMode, setEditMode] = useState(!user.alias);
  const [fullName, setFullName] = useState(user.full_name || "");
  const [email, setEmail] = useState(user.email || "");
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || "");
  const [alias, setAlias] = useState(user.alias || "");
  const [userAvi, setUserAvi] = useState(null);
  const [waiverAcknowledged, setWaiverAcknowledged] = useState(user.waiver_acknowledged);
  const [openModal, setOpenModal] = useState(false);
  const [showPostWaiverModal, setShowPostWaiverModal] = useState(false);

  useEffect(() => {
    if (user.alias && !user.waiver_acknowledged) {
      setOpenModal(true);
    }
  }, [user.alias, user.waiver_acknowledged]);

  useEffect(() => {
    // Prevent navigation away from the page without acknowledging the waiver
    const handleBeforeUnload = (event) => {
      if (!waiverAcknowledged) {
        event.preventDefault();
        event.returnValue = "";
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [waiverAcknowledged]);

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  const saveChanges = async () => {
    if (!alias.trim()) {
      alert("Alias is required. Please provide an alias before saving.");
      return;
    }

    const formData = new FormData();
    formData.append("email", email);
    formData.append("phone_number", phoneNumber);
    formData.append("alias", alias);
    if (userAvi) {
      formData.append("file", userAvi);
    }

    try {
      const response = await axios.put("/api/evidence/user", formData, {
        headers: {
          "Content-Type": "multipart/form/data",
        },
      });
      if (response.status === 200) {
        alert("User updated successfully.");
        setEditMode(false);
        dispatch({ type: "FETCH_USER" });
        if (!waiverAcknowledged) {
          setOpenModal(true);
        }
      } else {
        throw new Error("Failed to update user.");
      }
    } catch (error) {
      alert("Error updating user.");
      console.error("Error updating user:", error);
    }
  };

  const acknowledgeWaiver = async () => {
    try {
      const response = await axios.put(`/api/user/waiver/${user.id}`);
      if (response.status === 200) {
        setWaiverAcknowledged(true);
        setOpenModal(false);
        setShowPostWaiverModal(true);
        alert("Waiver acknowledged successfully.");
      } else {
        throw new Error("Failed to update waiver acknowledgment.");
      }
    } catch (error) {
      console.error("Error acknowledging waiver:", error);
    }
  };

  const attemptToExitEditMode = () => {
    if (alias.trim()) {
      setEditMode(false);
    } else {
      alert("Alias is required to exit editing. Please provide an alias.");
    }
  };

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

  function activateTutorial() {
    setShowPostWaiverModal(false);
    history.push("/evidence");
  }

  return (
    <ThemeProvider theme={theme}>
      <div
        style={{ padding: "70px 10px", color: "hsl(0, 0%, 97%)" }}
        className="user-container"
      >
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
        <Typography variant="h4" sx={{ textAlign: "center", padding: "10px", color: "hsl(0, 0%, 97%)" }}>
          {user.alias}
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
                  color: "hsl(0, 0%, 97%)",
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
                  color: "hsl(0, 0%, 97%)",
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
                  color: "hsl(0, 0%, 97%)",
                },
              }}
              label="Phone Number"
              variant="outlined"
              fullWidth
              margin="dense"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
            <TextField
              InputProps={{
                style: {
                  color: "hsl(0, 0%, 97%)",
                },
              }}
              label="Alias"
              variant="outlined"
              fullWidth
              margin="dense"
              value={alias}
              onChange={(e) => setAlias(e.target.value)}
              required
            />
            <UploadButton
              btnName={"Upload Avatar"}
              style={{
                marginTop: "10px",
                backgroundColor: "#c40f0f",
                color: "hsl(0, 0%, 97%)",
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
                color: "hsl(0, 0%, 97%)",
              }}
            >
              Save Changes
            </Button>
            <Button
              onClick={attemptToExitEditMode}
              variant="contained"
              style={{ backgroundColor: "#c40f0f", color: "hsl(0, 0%, 97%)" }}
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
              color: "hsl(0, 0%, 97%)",
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
                color: "hsl(0, 0%, 97%)",
              }}
            >
              Edit Profile
            </Button>
            <Button
              onClick={() => dispatch({ type: "LOGOUT" })}
              style={{
                backgroundColor: "#c40f0f",
                color: "hsl(0, 0%, 97%)",
              }}
              variant="outlined"
            >
              Log Out
            </Button>
          </div>
        )}

        <Modal
          open={openModal}
          onClose={() => setOpenModal(false)}
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="modal-title"
          aria-describedby="modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-title" variant="h6" component="h2">
              Waiver Acknowledgment
            </Typography>
            <Typography id="modal-description" sx={{ mt: 2 }}>
              Please watch the video below and acknowledge the waiver before
              continuing.
            </Typography>

            <Button
              onClick={acknowledgeWaiver}
              variant="contained"
              style={{
                marginTop:"20px",
                backgroundColor: "#c40f0f",
                color: "hsl(0, 0%, 97%)",
              }}
            >
              Acknowledge Waiver and Continue
            </Button>
          </Box>
        </Modal>

        <Modal
          open={showPostWaiverModal}
          onClose={() => setShowPostWaiverModal(false)}
          disableBackdropClick
          disableEscapeKeyDown
          aria-labelledby="post-waiver-modal-title"
          aria-describedby="post-waiver-modal-description"
        >
          <Box sx={style}>
            <Typography id="post-waiver-modal-title" variant="h6" component="h2">
              Welcome to the Community!
            </Typography>
            <Typography id="post-waiver-modal-description" sx={{ mt: 2 }}>
              Thank you for acknowledging the waiver. You're now ready to explore
              and contribute to our community. If you have any questions, feel
              free to reach out to us.
            </Typography>
            <video controls style={{ width: "100%", marginTop: "20px" }}>
              <source src="your-video-url.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
            <Button
              onClick={() => activateTutorial()}
              variant="contained"
              style={{
                marginTop: "20px",
                backgroundColor: "#c40f0f",
                color: "hsl(0, 0%, 97%)",
              }}
            >
              Close
            </Button>
          </Box>
        </Modal>
      </div>
    </ThemeProvider>
  );
}

export default UserPage;