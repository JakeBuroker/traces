import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DateTime } from "luxon";
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
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";


function Admin() {
  const dispatch = useDispatch();
  const evidenceList = useSelector((store) => store.evidence);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = () => {
    axios
      .get("/api/evidence/admin")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error("Could not fetch evidence:", error);
      });
  };

  const deleteEvidence = (evidenceId) => {
    axios
      .delete(`/api/evidence/delete/${evidenceId}`)
      .then(() => {
        fetchEvidence();
        setDeleteModalOpen(false);
        alert("Evidence deleted successfully!");
      })
      .catch((error) => {
        console.error("Error deleting evidence:", error);
        alert("Could not delete evidence!");
      });
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
  };

  const openDeleteConfirmModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
  };

  // Defines columns for the DataGrid component to display evidence information
  const columns = [
    { field: "title", headerName: "Title", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "datePosted", headerName: "Date Posted", width: 200 },
    { field: "notes", headerName: "Notes", width: 200 },
    // Renders action buttons for details modal and deleting evidence
    {
      field: "actions",
      headerName: "Details",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openModal(params.row)}
            style={{
              cursor: "pointer",
              marginRight: "5px",
            }}
            startIcon={<InfoIcon />}
          >
    
          </Button>
          
          <Button
            onClick={() => openDeleteConfirmModal(params.row)}
            style={{
              cursor: "pointer",
              marginRight: "5px",
            }}
            startIcon={<DeleteIcon />}
            color="error"
          >
     
          </Button>
        </div>
      ),
    },
  ];

  const rows = evidenceList.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    datePosted: DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED),
    notes: item.notes,
    aws_url: item.aws_url,
  }));

  return (
    <div style={{ height: 400, width: "100%" }}>
      <h1>Evidence Administration</h1>

      <DataGrid
        rows={rows}
        columns={columns}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection={false}
        disableSelectionOnClick
      />

      {/* Details Modal */}
      <Dialog
        open={detailsModalOpen} onClose={closeModal} 
        fullWidth
        maxWidth="md"
      >
        <DialogContent>
          {selectedItem && (
            <div>
              <Typography variant="h5" style={{ textAlign: "center" }}>
                {selectedItem.title}
              </Typography>
              <Typography variant="body1" style={{ textAlign: "center" }}>
                {selectedItem.notes}
              </Typography>
              <CardMedia
                  component="img"
                  src={selectedItem.aws_url}
                  className="item-image"
                  sx={{
                    height: 160,
                    width: "80%",
                    objectFit: "cover",
                    alignSelf: "center",
                  }}
                />
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


      {/* Delete Confirmation Modal */}
      <Dialog open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to delete this evidence?</Typography>
        </DialogContent>
        <Button onClick={() => deleteEvidence(selectedItem.id)} color="error">Delete</Button>
        <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
      </Dialog>
    </div>
  );
}

export default Admin;