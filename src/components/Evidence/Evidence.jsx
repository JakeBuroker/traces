import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Dialog, DialogContent, DialogActions, DialogTitle } from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DateTime } from "luxon";
import "./Evidence.css";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

function EvidencePage() {
  const evidence = useSelector((store) => store.evidence);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    user_id: '',
    title: '',
    notes: '',
    location: '',
  });

  useEffect(() => {
    fetchEvidence();
  }, [evidence.length]);

  const fetchEvidence = () => {
    axios.get("/api/evidence")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not fetch evidence!");
      });
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const detailsModalClose = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
  };

  useEffect(() => {
    fetchEvidence();
  }, [evidence.length]); 


  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditItem(item);
    setFormState({
      id: item.id,
      title: item.title,
      notes: item.notes,
      location: item.location,
      file: null, 
    });
    setIsEditing(true);
    setDetailsModalOpen(true);
  };

  const handleSave = () => {
    // Adjusted for potential file uploads
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    formData.append("location", formState.location);

    if (formState.file) { // Only append file if it exists
      formData.append("file", formState.file);
    }

    editEvidence(formState.id, formData); // Now passing ID and formData separately
    setIsEditing(false);
    setDetailsModalOpen(false);
  };

  const editEvidence = (id, formData) => {
    axios.put(`/api/evidence/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => fetchEvidence())
    .catch((error) => console.error("Error updating evidence:", error));
  };

  const handleCancel = () => {
    setIsEditing(false);
    detailsModalClose();
  };

  const deleteEvidence = (itemId) => {
    axios.delete(`/api/evidence/delete/${itemId}`)
      .then(() => fetchEvidence())
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmationOpen(true);
  };

  const confirmDelete = () => {
    deleteEvidence(itemToDelete.id);
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const isVideo = (mediaType) => {
    return mediaType === 3;
  };

  const hasMedia = (mediaType) => {
    return mediaType === 2 || mediaType === 3;
  };

  return (
    <main>
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {evidence.map((item) => (
            <Grid key={item.id} item xs={12} sm={8} md={6} lg={4}>
              <Card className="item-card" sx={{ display: "flex", flexDirection: "column", position: "relative" }}>
                <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "16px 0" }}>
                  {item.title}
                </Typography>
                {/* Conditionally render CardMedia for images or videos, skip for text-only */}
                {hasMedia(item.media_type) && (
                  isVideo(item.media_type) ? (
                    <video
                      src={item.aws_url}
                      controls
                      style={{ height: 160, width: "100%", objectFit: "cover" }}
                      onClick={() => openModal(item)}
                    />
                  ) : (
                    <img
                      src={item.aws_url}
                      alt={item.title}
                      style={{ height: 160, width: "100%", objectFit: "cover" }}
                      onClick={() => openModal(item)}
                    />
                  )
                )}
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
                    {item.notes}
                  </Typography>
                  <div style={{ display: "flex", justifyContent: "space-between" }}>
                    <Chip icon={<CreateIcon />} label="Edit" onClick={() => handleEdit(item)} />
                    <Chip icon={<DeleteForeverIcon />} label="Delete" onClick={() => handleDelete(item)} />
                  </div>
                </CardContent>
                <Typography variant="body2" sx={{ position: "absolute", bottom: 10, left: 10 }}>
                  {DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED)}
                </Typography>
                <Typography variant="body2" sx={{ position: "absolute", bottom: 10, right: 10 }}>
                  {item.location}
                </Typography>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog
        open={detailsModalOpen}
        onClose={detailsModalClose}
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
                  onClick={() => handleEdit(selectedItem)}
                  style={{ cursor: "pointer" }}
                />
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => handleDelete(selectedItem)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
    {isEditing && (
      <Dialog
  open={isEditing}
  onClose={(event, reason) => {
    if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
      setIsEditing(false);
    }
  }}
  fullWidth
  maxWidth="md"
  disableEscapeKeyDown // Prevents closing the dialog with the escape key
>
  <DialogTitle>Edit Item</DialogTitle>
  <DialogContent>
    <input
      onChange={(e) => setFormState({ ...formState, file: e.target.files[0] })}
      type="file"
      id="fileInput"
      multiple
    />
    <TextField
      autoFocus
      margin="dense"
      label="Title"
      type="text"
      fullWidth
      value={formState.title}
      onChange={(e) => setFormState({ ...formState, title: e.target.value })}
    />
    <TextField
      autoFocus
      margin="dense"
      label="Notes"
      type="text"
      fullWidth
      value={formState.notes}
      onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
    />
    <TextField
      autoFocus
      margin="dense"
      label="Location"
      type="text"
      fullWidth
      value={formState.location}
      onChange={(e) => setFormState({ ...formState, location: e.target.value })}
    />
  </DialogContent>
  <DialogActions>
    <Button onClick={() => handleCancel()} color="primary">
      Cancel
    </Button>
    <Button onClick={handleSave} color="primary">
      Save
    </Button>
  </DialogActions>
</Dialog>
)}
        </DialogContent>
      </Dialog>
      <EvidenceUploadButton />
      <Dialog
        open={deleteConfirmationOpen}
        onClose={cancelDelete}

      >
        <DialogTitle>{"Confirm Delete"}</DialogTitle>
        <DialogContent>
          <Typography>Are you sure you want to delete this evidence?</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </main>
  );
}

export default EvidencePage;