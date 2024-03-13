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
import "./EvidencePage.css";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import EvidenceCard from "../EvidenceCard/EvidenceCard";
import EvidenceDetailsModal from "../EvidenceDetailsModal/EvidenceDetailsModal";
import MediaFilter from "../MediaFilter/MediaFilter";

function EvidencePage() {
  const dispatch = useDispatch();
  const evidence = useSelector((store) => store.evidence);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [formState, setFormState] = useState({
    user_id: '',
    title: '',
    notes: '',
  });
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const [selectedMediaType, setSelectedCategories] = useState("all");
  const [acceptValue, setAcceptValue] = useState('');
  const [mediaTyping, setMediaTyping] = useState()

  useEffect(() => {
    fetchEvidence();
  }, [evidence.length]);

  
  const acceptionsMedia = (item) => {
    console.log("inside acceptionsmedia", mediaTyping);
    if(mediaTyping === 2){
      return 'image/*'
    }else if(mediaTyping === 3){
      return 'video/*'
    } else if (mediaTyping === 4){
      return 'audio/*'
    }
  }


  const fetchEvidence = () => {
    axios
      .get("/api/evidence")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not fetch evidence!");
      });
  };

  const handleMediaFilterChange = (event, newMediaType) => {
    setSelectedCategories(newMediaType);
  };

  const getFilteredEvidence = () => {
    if (selectedMediaType === "all") {
      return evidence;
    }
    const mediaTypeInt = parseInt(selectedMediaType, 10);
    return evidence.filter((item) => item.media_type === mediaTypeInt);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const detailsModalClose = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
  };

  const handleEdit = (item) => {
    console.log("item", item);
    acceptionsMedia(item)
    setMediaTyping(item.media_type)
    setSelectedItem(item);
    setEditItem(item);
    setFormState({
      id: item.id,
      title: item.title,
      notes: item.notes,
      // location: item.location,
      file: null,
    });
    setIsEditing(true);
    setDetailsModalOpen(true);
    setAcceptValue(acceptionsMedia())
    console.log(acceptValue);
    
  };

  const handleSave = () => {
    const formData = new FormData();
    formData.append("title", formState.title);
    formData.append("notes", formState.notes);
    formData.append("location", formState.location);
    if (formState.file) {
      formData.append("file", formState.file);
    }
    editEvidence(formState.id, formData);
    setIsEditing(false);
    setDetailsModalOpen(false);
  };

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

  const handleCancel = () => {
    setIsEditing(false);
    detailsModalClose();
  };

  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => fetchEvidence())
      .catch((error) => console.error("Error deleting evidence:", error));
  };

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

  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", padding: "60px" }}>
        <MediaFilter
          selectedMediaType={selectedMediaType}
          onMediaTypeChange={handleMediaFilterChange}
        />
      </div>
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {getFilteredEvidence().map((item) => (
            <EvidenceCard
              key={item.id}
              item={item}
              onEdit={() => handleEdit(item)}
              onDelete={() => handleDelete(item)}
              onOpenModal={() => openModal(item)}
            />
          ))}
        </Grid>
      </div>
      <EvidenceDetailsModal
        selectedItem={selectedItem}
        isOpen={detailsModalOpen}
        onClose={detailsModalClose}
        onEdit={() => handleEdit(selectedItem)}
        onDelete={() => handleDelete(selectedItem)}
      />

      <Dialog open={deleteConfirmationOpen} onClose={cancelDelete}>
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this evidence?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={cancelDelete}>Cancel</Button>
          <Button onClick={confirmDelete} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      {isEditing && (
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
                accept={acceptValue}
                multiple
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
            {/* <TextField
              margin="dense"
              label="Location"
              type="text"
              fullWidth
              value={formState.location}
              onChange={(e) =>
                setFormState({ ...formState, location: e.target.value })
              }
            /> */}
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
