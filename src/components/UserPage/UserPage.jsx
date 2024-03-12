import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom'; // Import useHistory for redirection
import LogOutButton from '../LogOutButton/LogOutButton';
import { Button, Modal, Box, Typography, TextField } from '@mui/material';
import './UserPage.css';

function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();
  const history = useHistory();

  // State for managing user editable details
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [alias, setAlias] = useState(user.alias || '');
  const [userAvi, setUserAvi] = useState(null);

  // State for handling the waiver acknowledgment modal
  const [waiverAcknowledged, setWaiverAcknowledged] = useState(user.waiver_acknowledged);
  const [openModal, setOpenModal] = useState(!user.waiver_acknowledged);

  useEffect(() => {
    if (!user.waiver_acknowledged) {
      setOpenModal(true);
    }
  }, [user.waiver_acknowledged]);

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('alias', alias);
    if (userAvi) {
      formData.append('user_avi', userAvi);
    }

    try {
      await axios.put('/api/evidence/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('User updated successfully.');
      setEditMode(false);
    } catch (error) {
      alert('Error updating user.');
      console.error('Error updating user:', error);
    }
  };

  const acknowledgeWaiver = async () => {
    try {
      // Dynamically include the user's ID in the URL path
      const response = await axios.put(`/api/user/waiver/${user.id}`);
      if (response.status === 200) {
        setWaiverAcknowledged(true); 
        setOpenModal(false);
      } else {
        throw new Error('Failed to update waiver acknowledgment.');
      }
    } catch (error) {
      console.error('Error acknowledging waiver:', error);
    }
  };
  
  
  // Modal style
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
  };

  return (
    <div  style={{padding:"60px"}} className="user-container">
      <h2>Welcome, {user.username}!</h2>
      {editMode ? (
        <form className="edit-form" onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
          <TextField label="Full Name" variant="outlined" fullWidth margin="dense" value={fullName} onChange={(e) => setFullName(e.target.value)} />
          <TextField label="Email" type="email" variant="outlined" fullWidth margin="dense" value={email} onChange={(e) => setEmail(e.target.value)} />
          <TextField label="Phone Number" variant="outlined" fullWidth margin="dense" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
          <TextField label="Alias" variant="outlined" fullWidth margin="dense" value={alias} onChange={(e) => setAlias(e.target.value)} />
          <div>
            <label htmlFor="userAvi">User Avatar:</label>
            <input type="file" id="userAvi" onChange={handleFileChange} />
          </div>
          <Button type="submit" variant="contained" color="primary">Save Changes</Button>
          <Button onClick={() => setEditMode(false)} variant="contained" color="secondary">Cancel</Button>
        </form>
      ) : (
        <div  style={{padding:"60px"}}  className="info-display">
          <p>Full Name: {fullName}</p>
          <p>Email: {email}</p>
          <p>Phone Number: {phoneNumber}</p>
          <p>Alias: {alias}</p>
          <p>User Avatar: {user.user_avi && <img src={user.user_avi} alt="User Avatar" style={{ width: '100px', height: '100px' }} />}</p>
          <p>Waiver Signed: {JSON.stringify(waiverAcknowledged)}</p>
          <Button onClick={() => setEditMode(true)} variant="contained" color="primary">Edit Profile</Button>
        </div>
      )}
      <LogOutButton />

      <Modal
        open={openModal}
        onClose={() => {}}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-title" variant="h6" component="h2">
            Waiver Acknowledgment
          </Typography>
          <Typography id="modal-description" sx={{ mt: 2 }}>
            Please watch the video below and acknowledge the waiver before continuing.
          </Typography>
          <video controls style={{ width: '100%', marginTop: '20px' }}>
            <source src="your-video-url.mp4" type="video/mp4" />
            Your browser does not support the video tag.
          </video>
          <Button onClick={acknowledgeWaiver} variant="contained" color="primary" style={{ marginTop: '20px' }}>
            Acknowledge Waiver and Continue
          </Button>
        </Box>
      </Modal>
    </div>
  );
}

export default UserPage;