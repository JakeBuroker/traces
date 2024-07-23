import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';
import axios from 'axios';
import {
  CardMedia,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  Button,
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import DataGridComponent from '../DataGridComponent/DataGridComponent';
import './AdminPage.css';

function AdminPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const evidenceList = useSelector((store) => store.evidence);
  const [users, setUsers] = useState([]);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [userEvidenceModalOpen, setUserEvidenceModalOpen] = useState(false);
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

  const fetchEvidence = () => {
    axios
      .get('/api/evidence/admin')
      .then((response) => {
        dispatch({ type: 'SET_EVIDENCE', payload: response.data });
      })
      .catch((error) => {
        console.error('Could not fetch evidence:', error);
      });
  };

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
      .then(() => {
        fetchEvidence();
      }).catch(err => {
        console.log(err);
      });
  };

  const handleMakeAllPublic = (bool) => {
    let route = bool ? 'makeAllPublic' : 'makeAllSecret';
    axios.put(`/api/evidence/${route}`)
      .then(() => {
        fetchEvidence();
        setAllPublicConfirmModalOpen(false);
      }).catch(err => {
        console.log(err);
      });
  };

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
    }).catch(err => {
      console.log(err);
    });
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
    axios.get(`/api/user/${user.id}/evidence`)
      .then((response) => {
        setSelectedUserEvidence(response.data);
        setUserEvidenceModalOpen(true);
      })
      .catch((error) => {
        console.error('Error fetching user evidence:', error);
      });
  };

  const closeModal = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
    setUserEvidenceModalOpen(false);
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

  return (
    <div style={{ padding: '75px', height: 500, width: '100%' }}>
      <h1 style={{ fontFamily: 'Merriweather', color: 'white' }}>Administration</h1>
      <div style={{ padding: '30px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', gap: '20px' }}>
          <Button
            variant='contained'
            onClick={() => openAllPublicModal(true)}
            style={{ backgroundColor: '#c40f0f', color: 'hsl(0, 0%, 97%)', marginRight: '10px' }}
          >
            Make All Public
          </Button>
          <Button
            variant='contained'
            onClick={() => openAllPublicModal(false)}
            style={{ backgroundColor: '#c40f0f', color: 'hsl(0, 0%, 97%)' }}
          >
            Make All Private
          </Button>
        </div>
      </div>
      <Button
        variant='contained'
        onClick={() => setView(view === 'evidence' ? 'users' : 'evidence')}
        style={{ backgroundColor: '#c40f0f', color: 'hsl(0, 0%, 97%)', marginBottom: '20px' }}
      >
        {view === 'evidence' ? 'Show Users' : 'Show Evidence'}
      </Button>
      <DataGridComponent
        data={{ evidence: evidenceList, users }}
        view={view}
        openModal={openModal}
        openPublicConfirmModal={openPublicConfirmModal}
        openDeleteConfirmModal={openDeleteConfirmModal}
        openDeleteUserConfirmModal={openDeleteUserConfirmModal}
        openUserEvidenceModal={openUserEvidenceModal}
      />
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
          {selectedUserEvidence.map((evidence) => (
            <div key={evidence.id}>
              {evidence.media_type === 4 ? (
                <audio src={evidence.aws_url} controls style={{ width: '100%' }} />
              ) : evidence.media_type === 3 ? (
                <video src={evidence.aws_url} controls style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain' }} />
              ) : (
                <CardMedia component='img' src={evidence.aws_url} className='item-image' style={{ maxHeight: '500px', maxWidth: '100%', objectFit: 'contain' }} />
              )}
              <Typography variant='h5'>Title: {evidence.title}</Typography>
              <Typography variant='body1'>Notes: {evidence.notes}</Typography>
              <Typography variant='body1'>Location: {evidence.location}</Typography>
              <Typography variant='body1'>Date Posted: {evidence.datePosted}</Typography>
            </div>
          ))}
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
    </div>
  );
}

export default AdminPage;
