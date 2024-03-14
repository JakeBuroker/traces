import axios from 'axios';
import { useState } from 'react';
import {Button, Dialog, DialogContent, DialogTitle, DialogActions, Typography, Chip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EvidenceDetailsModal = ({ selectedItem, isOpen, onClose, onEdit, fetchEvidence }) => {
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  
  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
        setDeleteModalOpen(false)
        onClose()
      })
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  const cancelDelete = () => {
    setDeleteModalOpen(false)
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          {selectedItem && (
            <div>
              <img
                src={selectedItem.aws_url}
                alt="item"
                style={{ width: "100%", height: "auto", objectFit: "cover" }}
              />
              <Typography variant="h5" style={{ textAlign: "center" }}>
                {selectedItem.title}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {selectedItem.notes}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                Location: {selectedItem.location}
              </Typography>
              <div
                style={{
                  display: "flex",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <Chip
                  icon={<CreateIcon />}
                  label="Edit"
                  onClick={() => onEdit(selectedItem)}
                  style={{ cursor: "pointer" }}
                />
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => setDeleteModalOpen(true)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <Dialog open={deleteModalOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this evidence?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete} autoFocus>Cancel</Button>
          <Button onClick={() => deleteEvidence(selectedItem.id)} color="warning">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvidenceDetailsModal;
