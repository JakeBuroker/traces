import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Chip
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EvidenceDetailsModal = ({ selectedItem, isOpen, onClose, editEvidence, deleteEvidence, acceptedMedia }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [formState, setFormState] = useState({
    user_id: selectedItem.id,
    title: selectedItem.title,
    notes: selectedItem.notes,
  });


  const cancelDelete = () => {
    setDeleteModalOpen(false)
  };

  const handleDelete = (id) => {
    deleteEvidence(id)
    setDeleteModalOpen(false)
    onClose()
  }

  const handleSave = (id) => {
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    if (formState.file) {
      formData.append("file", formState.file);
    }
    setIsEditing(false);
    // function for PUT request
    editEvidence(id, formData)
    onClose()
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
                  onClick={() => setIsEditing(true)}
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
          <Button onClick={() => handleDelete(selectedItem.id)} color="warning">
            Confirm
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={isEditing}
        onClose={(event, reason) => {
          if (reason !== "backdropClick" && reason !== "escapeKeyDown") {
            setIsEditing(false);
          }
        }}
        fullWidth
        maxWidth="md"
        disableEscapeKeyDown
      >
        <DialogTitle>Edit Item</DialogTitle>
        <DialogContent>
          {selectedItem.media_type !== 1 && (
            <input
              onChange={(e) =>
                setFormState({ ...formState, file: e.target.files[0] })
              }
              type="file"
              id="fileInput"
            accept={acceptedMedia(selectedItem.media_type)}
            />
          )}
          <TextField
            autoFocus
            margin="dense"
            label="Title"
            type="text"
            fullWidth
            value={formState.title}
            onChange={(e) =>
              setFormState({ ...formState, title: e.target.value })
            }
          />
          <TextField
            margin="dense"
            label="Notes"
            type="text"
            fullWidth
            value={formState.notes}
            onChange={(e) =>
              setFormState({ ...formState, notes: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditing(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={() => handleSave(selectedItem.id)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EvidenceDetailsModal;
