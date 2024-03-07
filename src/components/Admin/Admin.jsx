import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { DateTime } from "luxon";
import {
  CardMedia,
  Typography,
  Chip,
  Dialog,
  DialogContent,
  Button,
} from "@mui/material"
import { DataGrid } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import InfoIcon from "@mui/icons-material/Info";
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';


function Admin() {
  const dispatch = useDispatch();
  const evidenceList = useSelector((store) => store.evidence);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false)
  const [editsInput, setEditsInput] = useState({})

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

  const toggleIsPublic = (id) => {
    axios.put(`/api/evidence/clearance/${id}`)
      .then(() => {
        fetchEvidence()
      }).catch(err => {
        console.log(err);
      })
  }

  const makeAllPublic = (bool) => {
    let route
    if (bool) {
      route = 'makeAllPublic'
    } else {
      route = 'makeAllSecret'
    }
    axios.put(`/api/evidence/${route}`)
      .then(response => {
        fetchEvidence()
      }).catch(err => {
        console.log(err);
      })
  }

  const handleEdit = (item) => {
    setEditsInput({
      id: item.id,
      title: item.title,
      notes: item.notes,
    })
    setSelectedItem(item)
    console.log(item);
    setInEditMode(true)
  }

  const handleUpdate = (item) => {
    console.log(item);
    axios.put(`/api/evidence/update/${item.id}`, {
      title: item.title,
      notes: item.notes,
    }).then(response => {
      setInEditMode(false)
      fetchEvidence()
      setSelectedItem({...selectedItem, title: item.title, notes: item.notes})
    }).catch(err => {
      console.log(err);
    })
  }

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
    setInEditMode(false)
  };

  const openDeleteConfirmModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
    setInEditMode(false)
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
    <div style={{ height: 400, width: "100%" }}>
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

export default Admin;