import axios from 'axios';
import React, { useState } from 'react';
import {
  Button,
  Card,
  CardContent,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
  Chip,
  Grid
} from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DateTime } from 'luxon';
import EvidenceDetailsModal from '../EvidenceDetailsModal/EvidenceDetailsModal';

const EvidenceCard = ({ item, fetchEvidence }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [formState, setFormState] = useState({
    user_id: item.id,
    title: item.title,
    notes: item.notes,
  });
  const isVideo = (mediaType) => mediaType === 3;
  const isAudio = (mediaType) => mediaType === 4; // Check if the media type indicates audio
  const hasMedia = (mediaType) => mediaType === 2 || mediaType === 3 || mediaType === 4; // Include audio in the media check


  const editEvidence = (id, formData) => {
    axios
      .put(`/api/evidence/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => fetchEvidence())
      .catch((error) => console.error("Error updating evidence:", error));
  };

  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
        onClose()
      })
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  const onClose = () => {
    setIsOpen(false)
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

  const handleDelete = (id) => {
    deleteEvidence(id)
    setDeleteModalOpen(false)
  }

  const acceptedMedia = (typeNo) => {
    // console.log("inside acceptionsmedia");
    if (typeNo === 2) {
      return 'image/*'
    } else if (typeNo === 3) {
      return 'video/*'
    } else if (typeNo === 4) {
      return 'audio/*'
    }
  }

  return (
    <Grid item xs={3} sm={3} md={6} lg={4}>
      <Card className="item-card" sx={{ display: "flex", flexDirection: "column", position: "relative", boxShadow: 10, width: '175px' }}>
        {hasMedia(item.media_type) && (
          isAudio(item.media_type) ? (
            // Render an audio element for audio files
            <video
              onClick={() => onOpenModal(item)}
              src={item.aws_url}
              controls
              style={{ width: "100%" }}
            />
          ) : isVideo(item.media_type) ? (
            // Render a video element for video files
            <video
              src={item.aws_url}
              controls
              style={{ height: 160, width: "100%", objectFit: "cover" }}
              onClick={() => setIsOpen(true)}
            />
          ) : (
            // Render an img element for image files
            <img
              src={item.aws_url}
              alt={item.title}
              style={{ height: 160, width: 160, objectFit: "cover", marginTop: '5px' }}
              onClick={() => setIsOpen(true)}
            />
          )
        )}
        <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "16px 0" }}>
          {item.title}
        </Typography>
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            {item.notes}
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Chip icon={<CreateIcon />} label="Edit" onClick={() => setIsEditing(true)} />
            <Chip icon={<DeleteForeverIcon />} label="Delete" onClick={() => setDeleteModalOpen(true)} />
          </div>
        </CardContent>
        <Typography variant="body2" sx={{ position: "absolute", bottom: 10, left: 10 }}>
          {DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED)}
        </Typography>
        <Typography variant="body2" sx={{ position: "absolute", bottom: 10, right: 10 }}>
          {item.location}
        </Typography>
      </Card>

      <EvidenceDetailsModal
        selectedItem={item}
        isOpen={isOpen}
        onClose={onClose}
        editEvidence={editEvidence}
        deleteEvidence={deleteEvidence}
        acceptedMedia={acceptedMedia}
      />

      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this evidence?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteModalOpen(false)} autoFocus>Cancel</Button>
          <Button onClick={() => handleDelete(item.id)} color="warning">
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
          {item.media_type !== 1 && (
            <input
              onChange={(e) =>
                setFormState({ ...formState, file: e.target.files[0] })
              }
              type="file"
              id="fileInput"
              accept={acceptedMedia(item.media_type)}
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
          <Button onClick={() => handleSave(item.id)} color="primary">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
};

export default EvidenceCard;
