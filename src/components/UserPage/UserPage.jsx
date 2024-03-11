import React, { useState } from 'react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import LogOutButton from '../LogOutButton/LogOutButton';
import { Dialog, DialogTitle, DialogContent, TextField } from '@mui/material';
import './UserPage.css'; 
import { WashOutlined } from '@mui/icons-material';


function UserPage() {
  const user = useSelector((store) => store.user);
  const dispatch = useDispatch();

  // Editable user details states
  const [editMode, setEditMode] = useState(false);
  const [fullName, setFullName] = useState(user.full_name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phoneNumber, setPhoneNumber] = useState(user.phone_number || '');
  const [alias, setAlias] = useState(user.alias || '');
  const [Waiver, setWaiver] = useState(user.waiver_acknowledged);
  const [userAvi, setUserAvi] = useState(null); 

  const handleFileChange = (event) => {
    setUserAvi(event.target.files[0]);
  };

  const saveChanges = async () => {
    const formData = new FormData();
    formData.append('email', email);
    formData.append('phone_number', phoneNumber);
    formData.append('alias', alias);
    formData.append('waiver_acknowledged', Waiver,);
    if (userAvi) formData.append('file', userAvi);

    try {
      const response = await axios.put('/api/evidence/user', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        },
      });
      console.log('User updated:', response.data);
      setEditMode(false);
    } catch (error) {
      console.error('Error updating user:', error);
      // Handle error case
    }
  };

    return (
      <div className="user-container">
        <h2>Welcome, {user.username}!</h2>
        {editMode ? (
          <form className="edit-form" onSubmit={(e) => { e.preventDefault(); saveChanges(); }}>
            <div className="form-group">
              <label htmlFor="fullName">Full Name:</label>
              {fullName}
            </div>
            <div className="form-group">
              <label htmlFor="email">Email:</label>
              <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="phoneNumber">Phone Number:</label>
              <input type="tel" id="phoneNumber" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="alias">Alias:</label>
              <input id="alias" value={alias} onChange={(e) => setAlias(e.target.value)} />
            </div>
            <div className="form-group">
              <label htmlFor="userAvi">User Avatar:</label>
              <input type="file" id="userAvi" onChange={handleFileChange} />
            </div>
            <div className="form-group">
  <label>Waiver:</label>
  <div>
    <input
      type="radio"
      id="waiverYes"
      name="waiver"
      value="true"
      onChange={(e) => setWaiver(e.target.value === 'true')}
    />
    <label htmlFor="waiverYes">Yes</label>
  </div>
</div>
            <button type="submit" className="save-btn">Save Changes</button>
          </form>
        ) : (
          <div className="info-display">
            <div className="form-group">
              <label>Full Name:</label>
              <div>{fullName}</div>
            </div>
            <div className="form-group">
              <label>Email:</label>
              <div>{email}</div>
            </div>
            <div className="form-group">
              <label>Phone Number:</label>
              <div>{phoneNumber}</div>
            </div>
            <div className="form-group">
              <label>Alias:</label>
              <div>{alias}</div>
            </div>
            <div className="form-group">
              <label>User Avatar:</label>
              {user.user_avi && <img src={user.user_avi} alt="User Avatar" className="user-avi" />}
            </div>
            <div className="form-group">
              <label>Waiver Signed:</label>
              <div>{JSON.stringify(Waiver)}</div>
            </div>
            <button onClick={() => setEditMode(true)} className="edit-btn">Edit Profile</button>
          </div>
          
        )}
        <LogOutButton className="logout-btn" />
      </div>
    );
  }

export default UserPage;