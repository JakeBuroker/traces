import React, { useEffect, useState, lazy, Suspense } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import {
  CardMedia,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Avatar,
  Button,
  Grid,
  TextField
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import EvidenceCard from '../EvidenceCard/EvidenceCard';
import './AdminPage.css';

const DataGridComponent = lazy(() => import('../DataGridComponent/DataGridComponent'));

function AdminPage() {
  const dispatch = useDispatch();
  const evidenceList = useSelector((store) => store.evidence);

  const [users, setUsers] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [userEvidenceModalOpen, setUserEvidenceModalOpen] = useState(false);
  const [userInfoModalOpen, setUserInfoModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedUserEvidence, setSelectedUserEvidence] = useState([]);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [deleteUserModalOpen, setDeleteUserModalOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [editsInput, setEditsInput] = useState({});
  const [publicConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [allPublicConfirmModalOpen, setAllPublicConfirmModalOpen] = useState(false);
  const [makeAllPublic, setMakeAllPublic] = useState(true);
  const [view, setView] = useState('evidence');

  useEffect(() => {
    fetchEvidence();
    fetchUsers();
  }, []);

  // Function to fetch evidence data from the server
  const fetchEvidence = () => {
    axios
      .get("/api/evidence/admin")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not load evidence!");
      });
  };

  // Function to fetch users data from the server
  const fetchUsers = () => {
    axios
      .get('/api/user/users')
      .then((response) => {
        setUsers(response.data);
      })
      .catch((error) => {
        console.error('Could not fetch users:', error);
      });
  };

  const toggleIsPublic = (id) => {
    axios.put(`/api/evidence/clearance/${id}`)
      .then(fetchEvidence)
      .catch(err => console.error(err));
  };

  const handleMakeAllPublic = (bool) => {
    let route = bool ? 'makeAllPublic' : 'makeAllSecret';
    axios.put(`/api/evidence/${route}`)
      .then(() => {
        fetchEvidence();
        setAllPublicConfirmModalOpen(false);
      }).catch(err => console.error(err));
  };

  // Function to toggle the public status of an evidence item
  const handleEdit = (item) => {
    setEditsInput({
      id: item.id,
      title: item.title,
      notes: item.notes,
    });
    setSelectedItem(item);
    setInEditMode(true);
  };

  const handleUpdate = (item) => {
    axios.put(`/api/evidence/update/${item.id}`, {
      title: item.title,
      notes: item.notes,
    }).then(() => {
      setInEditMode(false);
      fetchEvidence();
      setSelectedItem({ ...selectedItem, title: item.title, notes: item.notes });
    }).catch(err => console.error(err));
  };

  const deleteEvidence = (evidenceId) => {
    axios.delete(`/api/evidence/delete/${evidenceId}`)
      .then(() => {
        fetchEvidence();
        setDeleteModalOpen(false);
        closeModal();
        alert('Evidence deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting evidence:', error);
        alert('Could not delete evidence!');
      });
  };

  const deleteUser = (userId) => {
    axios.delete(`/api/user/${userId}`)
      .then(() => {
        fetchUsers();
        setDeleteUserModalOpen(false);
        alert('User deleted successfully!');
      })
      .catch((error) => {
        console.error('Error deleting user:', error);
        alert('Could not delete user!');
      });
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const openUserEvidenceModal = (user) => {
    setSelectedItem(user);
    fetchUserEvidence(user.id);
  };

  // Function to fetch evidence data for a specific user
  const fetchUserEvidence = (userId) => {
    axios.get(`/api/user/${userId}/evidence`)
      .then((response) => {
        setSelectedUserEvidence(response.data);
        setUserEvidenceModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching user evidence:', error);
      });
  };

  // Function to close all modals
  const closeModal = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
    setUserEvidenceModalOpen(false);
    setUserInfoModalOpen(false);
    setInEditMode(false);
  };

  const openDeleteConfirmModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
    setInEditMode(false);
  };

  const openDeleteUserConfirmModal = (user) => {
    setSelectedItem(user);
    setDeleteUserModalOpen(true);
  };

  const openPublicConfirmModal = (item) => {
    setSelectedItem(item);
    setConfirmModalOpen(true);
  };

  const openAllPublicModal = (bool) => {
    setMakeAllPublic(bool);
    setAllPublicConfirmModalOpen(true);
  };

  const handleEvidenceUpdate = () => {
    fetchUserEvidence(selectedItem.id);
    fetchEvidence();
  };

  const openUserInfoModal = (user) => {
    setEditsInput({
      id: user.id,
      username: user.username,
      email: user.email,
      phone_number: user.phone_number,
      role: user.role,
      full_name: user.full_name,
      video_watched: user.video_watched,
    });
    setSelectedItem(user);
    setUserInfoModalOpen(true);
  };

  const handleUserUpdate = (user) => {
    axios.put(`/api/user/admin/${user.id}`, {
      username: editsInput.username,
      email: editsInput.email,
      phone_number: editsInput.phone_number,
      role: editsInput.role,
      full_name: editsInput.full_name,
      video_watched: editsInput.video_watched,
    }).then(() => {
      setInEditMode(false);
      fetchUsers();
      setSelectedItem({ ...selectedItem, ...editsInput });
    }).catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '75px', height: '100%', width: '100%' }}>
      <h1 style={{ fontFamily: 'Merriweather', color: 'black' }}>Administration</h1>
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button
            variant='contained'
            onClick={() => openAllPublicModal(true)}
            style={{ backgroundColor: '#ffffff', color: 'black', marginRight: '10px' }}
          >
            Make All Public
          </Button>
          <Button
            variant='contained'
            onClick={() => openAllPublicModal(false)}
            style={{ backgroundColor: '#ffffff', color: 'black' }}
          >
            Make All Private
          </Button>
        </div>
      </div>
      <Button
        variant='contained'
        onClick={() => setView(view === 'evidence' ? 'users' : 'evidence')}
        style={{ backgroundColor: '#ffffff', color: 'black', marginBottom: '20px' }}
      >
        {view === 'evidence' ? 'Show Users' : 'Show Evidence'}
      </Button>
      <Typography
        variant='h3'
        sx={{ textAlign: 'center', marginBottom: '20px' }}
      >
        {view === 'evidence' ? "Evidence" : "Users"}
      </Typography>
      <Suspense fallback={<div>Loading...</div>}>
        <DataGridComponent
          data={{ evidence: evidenceList, users }}
          view={view}
          openModal={openModal}
          openPublicConfirmModal={openPublicConfirmModal}
          openDeleteConfirmModal={openDeleteConfirmModal}
          openDeleteUserConfirmModal={openDeleteUserConfirmModal}
          openUserEvidenceModal={openUserEvidenceModal}
          openUserInfoModal={openUserInfoModal}
        />
      </Suspense>
      <Dialog open={detailsModalOpen} onClose={closeModal} fullWidth maxWidth='md'>
        <DialogContent>
          {selectedItem && (
            <div>
              {selectedItem.media_type === 4 ? (
                <audio src={selectedItem.aws_url} controls style={{ width: '100%' }} />
              ) : selectedItem.media_type === 3 ? (
                <video src={selectedItem.aws_url} controls style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <CardMedia component='img' src={selectedItem.aws_url} className='item-image' style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain' }} />
              )}
              {inEditMode ? (
                <Typography variant='h5'>
                  Title: <input value={editsInput.title} onChange={(e) => setEditsInput({ ...editsInput, title: e.target.value })} />
                </Typography>
              ) : (
                <Typography variant='h5'>Title: {selectedItem.title}</Typography>
              )}
              {inEditMode ? (
                <Typography variant='h5'>
                  Notes: <input value={editsInput.notes} onChange={(e) => setEditsInput({ ...editsInput, notes: e.target.value })} />
                </Typography>
              ) : (
                <Typography variant='body1'>Notes: {selectedItem.notes}</Typography>
              )}
              <Typography variant='body1'>Location: {selectedItem.location}</Typography>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                {inEditMode ? (
                  <Chip icon={<CreateIcon />} label='Save' onClick={() => handleUpdate(editsInput)} color='primary' style={{ cursor: 'pointer' }} />
                ) : (
                  <Chip icon={<CreateIcon />} label='Edit' onClick={() => handleEdit(selectedItem)} style={{ cursor: 'pointer' }} />
                )}
                <Chip icon={<DeleteForeverIcon />} label='Delete' onClick={() => openDeleteConfirmModal(selectedItem)} color='error' style={{ cursor: 'pointer' }} />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={userEvidenceModalOpen} onClose={closeModal} fullWidth maxWidth='md'>
        <DialogContent>
          <Grid container spacing={2}>
            {selectedUserEvidence.map((item) => (
              <EvidenceCard
                key={item.id}
                item={item}
                fetchEvidence={handleEvidenceUpdate}
              />
            ))}
            {selectedUserEvidence.length === 0 && (
              <Typography variant="body1" style={{ margin: 'auto' }}>User has not uploaded any evidence</Typography>
            )}
          </Grid>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={() => { setDeleteModalOpen(false); setInEditMode(false); }}>
        <DialogContent>
          <Typography>Are you sure you want to delete this evidence?</Typography>
          <Button onClick={() => deleteEvidence(selectedItem.id)} color='error'>Delete</Button>
          <Button onClick={() => { setDeleteModalOpen(false); setInEditMode(false); }}>Cancel</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={deleteUserModalOpen} onClose={() => setDeleteUserModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to delete this user?</Typography>
          <Button onClick={() => deleteUser(selectedItem.id)} color='error'>Delete</Button>
          <Button onClick={() => setDeleteUserModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={publicConfirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to change the visibility of this evidence?</Typography>
          <Button onClick={() => { toggleIsPublic(selectedItem.id); setConfirmModalOpen(false); }} color='primary'>Confirm</Button>
          <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={allPublicConfirmModalOpen} onClose={() => setAllPublicConfirmModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to change the visibility of all evidence to {makeAllPublic ? 'public' : 'private'}?</Typography>
          <Button onClick={() => handleMakeAllPublic(makeAllPublic)} color='primary'>Confirm</Button>
          <Button onClick={() => setAllPublicConfirmModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
      <Dialog open={userInfoModalOpen} onClose={closeModal} fullWidth maxWidth='md'>
        <DialogTitle>User Information</DialogTitle>
        <DialogContent>
          {selectedItem && (
            <div>
              <Avatar src={selectedItem.avatar_AWS_URL} alt="User Avatar" style={{ width: 200, height: 200, margin: 'auto' }} />
              <Avatar src={selectedItem.verification_photo_AWS_URL} alt="A user's groovy selfie" style={{ width: 200, height: 200, margin: 'auto' }} />
              {inEditMode ? (
                <>
                  <TextField
                    label="Username"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editsInput.username}
                    onChange={(e) => setEditsInput({ ...editsInput, username: e.target.value })}
                  />
                  <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editsInput.email}
                    onChange={(e) => setEditsInput({ ...editsInput, email: e.target.value })}
                  />
                  <TextField
                    label="Phone Number"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editsInput.phone_number}
                    onChange={(e) => setEditsInput({ ...editsInput, phone_number: e.target.value })}
                  />
                  <TextField
                    label="Role"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editsInput.role}
                    disabled
                    onChange={(e) => setEditsInput({ ...editsInput, role: e.target.value })}
                  />
                  <TextField
                    label="Full Name"
                    variant="outlined"
                    fullWidth
                    margin="dense"
                    value={editsInput.full_name}
                    onChange={(e) => setEditsInput({ ...editsInput, full_name: e.target.value })}
                  />
                  <TextField
                    label="Video Watched"
                    variant="outlined"
                    fullWidth
                    disabled
                    margin="dense"
                    value={editsInput.video_watched}
                    onChange={(e) => setEditsInput({ ...editsInput, video_watched: e.target.value })}
                  />
                  <Button
                    onClick={() => handleUserUpdate(editsInput)}
                    variant="contained"
                    color="primary"
                    style={{ marginTop: '20px' }}
                  >
                    Save Changes
                  </Button>
                  <Button
                    onClick={() => setInEditMode(false)}
                    variant="contained"
                    style={{ marginTop: '20px', marginLeft: '10px' }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <>
                  <Typography variant='h6'>Username: {selectedItem.username}</Typography>
                  <Typography variant='body1'>Email: {selectedItem.email}</Typography>
                  <Typography variant='body1'>Phone Number: {selectedItem.phone_number}</Typography>
                  <Typography variant='body1'>Role: {selectedItem.role === 1 ? "User" : "Admin"}</Typography>
                  <Typography variant='body1'>Full Name: {selectedItem.full_name}</Typography>
                  <Typography variant='body1'>Video Watched: {JSON.stringify(selectedItem.video_watched)}</Typography>
                  <Button
                    onClick={() => setInEditMode(true)}
                    variant="contained"
                    style={{ marginTop: '20px', backgroundColor: '#c40f0f', color: 'hsl(0, 0%, 97%)' }}
                  >
                    Edit User
                  </Button>
                </>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPage;
