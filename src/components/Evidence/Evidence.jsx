import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import {
  Dialog,
  DialogContent,
  DialogActions,
  DialogTitle,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import "./Evidence.css"
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import EvidenceCard from "../EvidenceCard/EvidenceCard";
import EvidenceDetailsModal from "../EvidenceDetailsModal/EvidenceDetailsModal";

function EvidencePage() {
  const evidence = useSelector((store) => store.evidence);
  const dispatch = useDispatch();
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); 
  const [editItem, setEditItem] = useState(null); // Stores the evidence item currently being edited.
  const [isEditing, setIsEditing] = useState(false); // Flag to indicate whether the user is in edit mode.
  const [formState, setFormState] = useState({ // Form state for adding or editing evidence.
    user_id: '',
    title: '',
    notes: '',
    location: '',
  });
  // State and functions for handling the deletion confirmation dialog.
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);

  // Fetches evidence when component mounts or the evidence list changes.
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

  // Initiates the edit process for an evidence item.
  const handleEdit = (item) => {
    setSelectedItem(item);
    setEditItem(item);
    setFormState({ // Prepares the form with the item's current data.
      id: item.id,
      title: item.title,
      notes: item.notes,
      location: item.location,
      file: null,
    });
    setIsEditing(true); // Enters edit mode.
    setDetailsModalOpen(true); // Opens the modal in edit mode.
  };

  // Handles the save action after editing an evidence item.
  const handleSave = () => {
    const formData = new FormData(); // Prepares form data for HTTP submission, including file uploads.
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    formData.append("location", formState.location);
    if (formState.file) {
      formData.append("file", formState.file); // Includes the file in the form data if present.
    }
    editEvidence(formState.id, formData); // Submits the edited evidence data.
    setIsEditing(false); // Exits edit mode.
    setDetailsModalOpen(false); // Closes the modal.
  };

  // Submits the edited evidence data to the server.
  const editEvidence = (id, formData) => {
    axios.put(`/api/evidence/update/${id}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
    .then(() => fetchEvidence())
    .catch((error) => console.error("Error updating evidence:", error));
  };

  // Cancels the editing process and closes the modal.
  const handleCancel = () => {
    setIsEditing(false);
    detailsModalClose();
  };

  const deleteEvidence = (itemId) => {
    axios.delete(`/api/evidence/delete/${itemId}`)
      .then(() => fetchEvidence()) // Refreshes the evidence list on success.
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  // Prepares to delete an evidence item by opening the confirmation dialog.
  const handleDelete = (item) => {
    setItemToDelete(item);
    setDeleteConfirmationOpen(true);
  };

  // Confirms the deletion of the selected evidence item.
  const confirmDelete = () => {
    deleteEvidence(itemToDelete.id);
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  // Cancels the deletion process and closes the confirmation dialog.
  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  return (
    <main>
      {/* Main container for displaying evidence cards. */}
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {evidence.map((item) => (
            <EvidenceCard
              key={item.id}
              item={item}
              onEdit={handleEdit}
              onDelete={handleDelete}
              onOpenModal={openModal}
            />
          ))}
        </Grid>
      </div>
      {/* The details modal for viewing or editing evidence. */}
      <EvidenceDetailsModal
        selectedItem={selectedItem}
        isOpen={detailsModalOpen}
        onClose={detailsModalClose}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      {/* Button for uploading new evidence. */}
      <EvidenceUploadButton />
      {/* Confirmation dialog for deleting evidence. */}
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
      {/* Modal for editing an evidence item. */}
      {isEditing && (
        <Dialog
          open={isEditing}
          onClose={(event, reason) => {
            // Prevents modal close on backdrop click or escape key press.
            if (reason !== 'backdropClick' && reason !== 'escapeKeyDown') {
              setIsEditing(false);
            }
          }}
          fullWidth
          maxWidth="md"
          disableEscapeKeyDown
        >
          <DialogTitle>Edit Item</DialogTitle>
          <DialogContent>
            {/* Form inputs for editing evidence details, including a file upload. */}
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
              margin="dense"
              label="Notes"
              type="text"
              fullWidth
              value={formState.notes}
              onChange={(e) => setFormState({ ...formState, notes: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Location"
              type="text"
              fullWidth
              value={formState.location}
              onChange={(e) => setFormState({ ...formState, location: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCancel} color="primary">
              Cancel
            </Button>
            <Button onClick={handleSave} color="primary">
              Save
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </main>
  );
}

export default EvidencePage;