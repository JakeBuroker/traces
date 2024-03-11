import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DateTime } from "luxon"
import {
  CardMedia,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import './AdminPage.css'

function AdminPage() {
  const dispatch = useDispatch();
  const evidenceList = useSelector((store) => store.evidence); // Access evidence data from the Redux store.
  const [detailsModalOpen, setDetailsModalOpen] = useState(false); // State for controlling the visibility of the details modal.
  const [selectedItem, setSelectedItem] = useState(null); // State for tracking the currently selected item for details or editing.
  const [deleteModalOpen, setDeleteModalOpen] = useState(false); // State for controlling the visibility of the delete confirmation modal.
  const [inEditMode, setInEditMode] = useState(false); // State to toggle between view and edit modes in the modal.
  const [editsInput, setEditsInput] = useState({}); // State for managing inputs in the edit form.

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

  // Function to toggle the public/private status of an evidence item.
  const toggleIsPublic = (id) => {
    axios.put(`/api/evidence/clearance/${id}`)
      .then(() => {
        fetchEvidence();
      }).catch(err => {
        console.log(err);
      });
  };

  // Function to make all evidence items either public or private, based on the provided boolean value.
  const makeAllPublic = (bool) => {
    let route = bool ? 'makeAllPublic' : 'makeAllSecret';
    axios.put(`/api/evidence/${route}`)
      .then(() => {
        fetchEvidence();
      }).catch(err => {
        console.log(err);
      });
  };

  // Function to prepare and set the selected item for editing.
  const handleEdit = (item) => {
    setEditsInput({
      id: item.id,
      title: item.title,
      notes: item.notes,
    });
    setSelectedItem(item);
    setInEditMode(true);
  };

  // Function to update the edited item's details on the server.
  const handleUpdate = (item) => {
    axios.put(`/api/evidence/update/${item.id}`, {
      title: item.title,
      notes: item.notes,
    }).then(() => {
      setInEditMode(false);
      fetchEvidence();
      setSelectedItem({...selectedItem, title: item.title, notes: item.notes});
    }).catch(err => {
      console.log(err);
    });
  };

  const deleteEvidence = (evidenceId) => {
    axios.delete(`/api/evidence/delete/${evidenceId}`)
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

  // Function to open the details modal for a selected item.
  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  // Function to close any open modal and reset the edit mode.
  const closeModal = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
    setInEditMode(false);
  };

  // Function to open the delete confirmation modal for a selected item.
  const openDeleteConfirmModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
    setInEditMode(false);
  };

  // Defines columns for the DataGrid component to display evidence information
  const columns = [
    { field: "title", headerName: "Evidence Title", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "datePosted", headerName: "Date Posted", width: 200 },
    { field: "notes", headerName: "Notes", width: 200 },
    { field: "postedBy", headerName: "Post By", width: 200 },
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
        </div>
      ),
    },
    {
      field: "actions1",
      headerName: "Toggle Secrecy",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => toggleIsPublic(params.row.id)}
            style={{
              cursor: "pointer",
              marginRight: "5px",
            }}
            startIcon={params.row.isPublic ? <VisibilityIcon /> : <VisibilityOffIcon />}
          >
            {params.row.isPublic ? 'Public' : 'Hidden'}
          </Button>
        </div>
      ),
    },
    {
      field: "actions2",
      headerName: "Delete?",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
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
  
// Render the Admin component UI, including buttons, DataGrid, and modals for details and delete confirmation.
  const rows = evidenceList.map((item) => ({
    id: item.id,
    title: item.title,
    location: item.location,
    datePosted: DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED),
    notes: item.notes,
    aws_url: item.aws_url,
    postedBy: item.full_name,
    isPublic: item.is_public,
  }));

  return (
    <div style={{     padding: "70px", height: 500, width: "100%",  }}>
      <h1>Evidence Administration</h1>
      <div>
        <Button variant="outlined" onClick={() => makeAllPublic(true)}>Make All Public</Button>
        <Button variant="outlined" onClick={() => makeAllPublic(false)}>Make All Private</Button>
      </div>

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
              <div>
                <CardMedia
                  component="img"
                  src={selectedItem.aws_url}
                  className="item-image"
                  sx={{ marginBottom: '50px' }}
                />
                {inEditMode ? <Typography variant="h5">Title: <input value={editsInput.title} onChange={(e) => setEditsInput({ ...editsInput, title: e.target.value })} /></Typography> : <Typography variant="h5">
                  Title: {selectedItem.title}
                </Typography>}
                {inEditMode ? <Typography variant="h5">Notes: <input value={editsInput.notes} onChange={(e) => setEditsInput({ ...editsInput, notes: e.target.value })} /></Typography> : <Typography variant="body1">
                  Notes: {selectedItem.notes}
                </Typography>}
                <Typography variant="body1">
                  Location: {selectedItem.location}
                </Typography>
              </div>
              <div style={{
                display: "flex",
                justifyContent: "center",
                gap: "10px",
              }}
              >
                {inEditMode ? <Chip
                  icon={<CreateIcon />}
                  label="Save"
                  onClick={() => handleUpdate(editsInput)}
                  style={{ cursor: "pointer" }}
                  color="primary"
                /> : <Chip
                  icon={<CreateIcon />}
                  label="Edit"
                  onClick={() => handleEdit(selectedItem)}
                  style={{ cursor: "pointer" }}
                />}
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => openDeleteConfirmModal(selectedItem)}
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

export default AdminPage;