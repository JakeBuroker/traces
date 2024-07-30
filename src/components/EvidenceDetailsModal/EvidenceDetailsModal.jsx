import { useState } from 'react';
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogActions,
  Typography,
  TextField,
  Chip,
  Box
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EvidenceDetailsModal = ({ selectedItem, isOpen, onClose, editEvidence, deleteEvidence, acceptedMedia }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [formState, setFormState] = useState({
    user_id: selectedItem.id,
    title: selectedItem.title,
    notes: selectedItem.notes,
  });

  const cancelDelete = () => {
    setDeleteModalOpen(false);
  };

  const handleDelete = (id) => {
    deleteEvidence(id);
    setDeleteModalOpen(false);
    onClose();
  };

  const handleSave = (id) => {
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    if (formState.file) {
      formData.append("file", formState.file);
    }
    setIsEditing(false);
    editEvidence(id, formData);
    onClose();
  };

  const renderImageForMediaItem = ({ media_type, aws_url, title }) => {
    if (media_type === 4) {
      return (
        <video
          src={aws_url}
          controls
          style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
          poster='./audio_placeholder.jpeg'
        />
      );
    } else if (media_type === 3) {
      return (
        <video
          src={aws_url}
          controls
          style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
          poster='./video_placeholder.jpeg'
        />
      );
    } else if (media_type === 2) {
      return (
        <img
          src={aws_url}
          alt={title}
          style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "cover", margin: '5px 0' }}
        />
      );
    }
  };

  return (
    <>
      <Dialog
        open={isOpen}
        onClose={onClose}
        fullWidth
        maxWidth="sm"
      >
        <DialogContent>
          {selectedItem && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              {renderImageForMediaItem(selectedItem)}
              {selectedItem.is_public && (
                <Box
                  sx={{
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    color: 'white',
                    padding: '2px 4px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    marginTop: '8px',
                  }}
                >
                  Public
                </Box>
              )}
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
                  color="default"
                  style={{ cursor: "pointer" }}
                />
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => setDeleteModalOpen(true)}
                  color="error"
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
        sx={{ border: "solid" }}
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
          <Button onClick={() => setIsEditing(false)} color="error">
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


