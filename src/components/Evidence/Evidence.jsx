import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Grid,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { DateTime } from "luxon";
import "./Evidence.css";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";

function EvidencePage() {
  const evidence = useSelector((store) => store.evidence);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [deleteConfirmationOpen, setDeleteConfirmationOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = () => {
    axios
      .get("/api/evidence/")
      .then((response) => {
        // Ensure this action type matches what your reducer expects
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

  const handleEdit = (item) => {
    console.log("Edit:", item.id);
  };

  const openDeleteConfirmation = (item) => {
    setItemToDelete(item);
    setDeleteConfirmationOpen(true);
  };

  const closeDeleteConfirmation = () => {
    setDeleteConfirmationOpen(false);
    setItemToDelete(null);
  };

  const handleDelete = () => {
    if (itemToDelete) {
      deleteEvidence(itemToDelete.id);
    }
    closeDeleteConfirmation();
  };

  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
      })
      .catch((error) => {
        console.error("Error deleting evidence:", error);
        alert("Could not delete evidence.");
      });
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
                <Typography
                  variant="h5"
                  component="div"
                  sx={{ textAlign: "center", margin: "16px 0" }}
                >
                  {item.title}
                </Typography>
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
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ marginBottom: 2 }}
                  >
                    {item.notes}
                  </Typography>
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
                      onClick={() => handleEdit(item)}
                    />
                    <Chip
                      icon={<DeleteForeverIcon />}
                      label="Delete"
                      onClick={() => openDeleteConfirmation(item)}
                    />
                  </div>
                </CardContent>
                <Typography
                  variant="body2"
                  sx={{ position: "absolute", bottom: 10, left: 10 }}
                >
                  {DateTime.fromISO(item.date_posted).toLocaleString(
                    DateTime.DATETIME_MED
                  )}
                </Typography>
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
                  onClick={() => openDeleteConfirmation(selectedItem)}
                  style={{ cursor: "pointer" }}
                />
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={deleteConfirmationOpen} onClose={closeDeleteConfirmation}>
        <DialogContent>
          <Typography>
            Are you sure you want to delete this evidence?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeDeleteConfirmation}>Cancel</Button>
          <Button onClick={handleDelete} color="primary" autoFocus>
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <EvidenceUploadButton />
    </main>
  );
}

export default EvidencePage;
