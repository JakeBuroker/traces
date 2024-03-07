import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { Dialog, DialogContent, DialogActions, DialogTitle} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DateTime } from "luxon";
import "./Evidence.css";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';



function EvidencePage() {
  const evidence = useSelector((store) => store.evidence);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const dispatch = useDispatch();
  const [formState, setFormState] = useState({
    user_id: '',
    title: '',
    notes: '',
    location: '',
   });

  useEffect(() => {
    fetchEvidence();
  }, []);


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

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const detailsModalClose = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
  };

  const editEvidence = (info) => {
    console.log("Inside of editEvidence", info);
    axios.put(
      `/api/evidence/update/${info.id}`, info)
      .then(() => {
        fetchEvidence()
      }).catch((error) => {
        console.log("Error in the PUT", error);
      })
  }

  const startEdit = (item) => {
    handleEdit(item)
    openModal()
  }

  const handleEdit = (item) => {
    // Implement edit functionality here
    console.log("Edit button was clicked", item);
    setEditItem(item);
    setFormState({
      id: item.id,
       title: item.title,
       notes: item.notes,
      //  date_posted: DateTime.fromISO(item.date_posted).toISO(),
       location: item.location,
    });
    setIsEditing(true);

  };
  const handleSave = () => {
    // Update the item in your state or backend
    // For example, to update in state:
    console.log("formState", formState);
    // const updatedEvidence = evidence.map((item) =>
    //    item.id === editItem.id ? { ...item, ...formState } : item
    // );
    editEvidence(formState);
    setIsEditing(false);
    detailsModalClose();
   };

   const handleCancel = () => {
    setIsEditing(false)
    detailsModalClose();
   }


  const deleteEvidence = (itemId) => {
    axios.delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
      })
      .catch((error) => {
        console.error("Error deleting evidence:", console.log(itemId));
        if (error.response) {
          alert(`Could not delete evidence: ${error.response.data.message}`);
        } else if (error.request) {
          console.log(error.request);
          alert("No response from server on delete attempt");
        } else {
          console.log('Error', error.message);
          alert("Error deleting evidence");
        }
      });
  };

  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null); 

  const handleDelete = (item) => {
    setItemToDelete(item); 
    setDeleteConfirmationOpen(true); 
  };

  const confirmDelete = () => {
    if (itemToDelete) {
      deleteEvidence(itemToDelete.id);
      setDeleteConfirmationOpen(false); 
      setItemToDelete(null);
    }
  };

  const cancelDelete = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };
  return (
    <main>
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {evidence.map((item) => (
            <Grid key={item.id} item xs={12} sm={8} md={6} lg={3}>
              <Card
                className="item-card"
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  position: "relative",
                  height: 450,
                }}
              >
                {/* Title */}
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center", margin: "16px 0" }}
                >
                  {item.title}
                </Typography>

                {/* Image */}
                <CardMedia
                  component="img"
                  src={item.aws_url}
                  className="item-image"
                  onClick={() => openModal(item)}
                  sx={{
                    height: 160,
                    width: "80%",
                    objectFit: "cover",
                    alignSelf: "center",
                  }}
                />

                <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                  {/* Notes */}
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 2 }}
                  >
                    {item.notes}
                  </Typography>

                  {/* Buttons */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "center",
                      gap: "20px",
                    }}
                  >
                    <Chip
                      icon={<CreateIcon />}
                      label="Edit"
                      onClick={() => startEdit(item)}
                    />
                    <Chip
                      icon={<DeleteForeverIcon />}
                      label="Delete"
                      onClick={() => handleDelete(item)}
                    />
                  </div>
                </CardContent>

                {/* Date - Bottom Left */}
                <Typography
                  variant="body2"
                  sx={{ position: "absolute", bottom: 10, left: 10 }}
                >
                  {DateTime.fromISO(item.date_posted).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Typography>

                {/* Location - Bottom Right */}
                <Typography
                  variant="body2"
                  sx={{ position: "absolute", bottom: 10, right: 10 }}
                >
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
    <Dialog open={isEditing} onClose={() => setIsEditing(false)}>
    <DialogTitle>Edit Item</DialogTitle>
    <DialogContent>
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