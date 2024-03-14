import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import { DateTime } from "luxon";
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
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import "./AdminPage.css";

function AdminPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  const evidenceList = useSelector((store) => store.evidence);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [inEditMode, setInEditMode] = useState(false);
  const [editsInput, setEditsInput] = useState({});
  const [publicConfirmModalOpen, setConfirmModalOpen] = useState(false);
  const [allPublicConfirmModalOpen, setAllPublicConfirmModalOpen] = useState(false);
  const [makeAllPublic, setMakeAllPublic] = useState(true);

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
        fetchEvidence();
      }).catch(err => {
        console.log(err);
      });
  };

  const handleMakeAllPublic = (bool) => {
    let route = bool ? 'makeAllPublic' : 'makeAllSecret';
    axios.put(`/api/evidence/${route}`)
      .then(() => {
        fetchEvidence();
        setAllPublicConfirmModalOpen(false);
      }).catch(err => {
        console.log(err);
      });
  };

  const handleEdit = (item) => {
    setEditsInput({
      id: item.id,
      title: item.title,
      notes: item.notes,
    });
    setSelectedItem(item);
    setInEditMode(true);
  };

  const handleUpdate = (item) => {
    axios.put(`/api/evidence/update/${item.id}`, {
      title: item.title,
      notes: item.notes,
    }).then(() => {
      setInEditMode(false);
      fetchEvidence();
      setSelectedItem({ ...selectedItem, title: item.title, notes: item.notes });
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

  const openModal = (item) => {
    setSelectedItem(item);
    setDetailsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedItem(null);
    setDetailsModalOpen(false);
    setInEditMode(false);
  };

  const openDeleteConfirmModal = (item) => {
    setSelectedItem(item);
    setDeleteModalOpen(true);
    setInEditMode(false);
  };

  const openPublicConfirmModal = (item) => {
    setSelectedItem(item);
    setConfirmModalOpen(true);
  };

  const openAllPublicModal = (bool) => {
    setMakeAllPublic(bool);
    setAllPublicConfirmModalOpen(true);
  };

  const columns = [
    { field: "title", headerName: "Evidence Title", width: 150 },
    { field: "location", headerName: "Location", width: 150 },
    { field: "datePosted", headerName: "Date Posted", width: 200 },
    { field: "notes", headerName: "Notes", width: 200 },
    { field: "postedBy", headerName: "Posted By", width: 200 },
    {
      field: "actions",
      headerName: "Details",
      sortable: false,
      width: 150,
      renderCell: (params) => (
        <div>
          <Button
            onClick={() => openModal(params.row)}
            style={{ cursor: "pointer", marginRight: "5px" }}
            startIcon={<InfoIcon />}
          />
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
            onClick={() => openPublicConfirmModal(params.row)}
            style={{ cursor: "pointer", marginRight: "5px" }}
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
            style={{ cursor: "pointer", marginRight: "5px" }}
            startIcon={<DeleteIcon />}
            color="error"
          />
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
    media_type: item.media_type, // Assuming this property exists
  }));

  return (
    <div style={{ padding: "70px", height: 500, width: "100%" }}>
      <h1>Evidence Administration</h1>
      <div style={{ display: 'flex', justifyContent: 'space-between'}}>
        <div>
          <Button variant="outlined" onClick={() => openAllPublicModal(true)}>Make All Public</Button>
          <Button variant="outlined" onClick={() => openAllPublicModal(false)}>Make All Private</Button>
        </div>
        <Button variant="outlined" onClick={() => history.push('/registration')}>Register New User</Button>
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
      <Dialog open={detailsModalOpen} onClose={closeModal} fullWidth maxWidth="md">
        <DialogContent>
          {selectedItem && (
            <div>
              {/* Conditional rendering for audio, video, or image */}
              {selectedItem.media_type === 4 ? (
                <audio
                  src={selectedItem.aws_url}
                  controls
                  style={{ width: '100%' }}
                />
              ) : selectedItem.media_type === 3 ? (
                <video
                  src={selectedItem.aws_url}
                  controls
                  style={{ width: '100%' }}
                />
              ) : (
                <CardMedia
                  component="img"
                  src={selectedItem.aws_url}
                  className="item-image"
                  sx={{ marginBottom: '50px' }}
                />
              )}
              {inEditMode ? (
                <Typography variant="h5">
                  Title: <input value={editsInput.title} onChange={(e) => setEditsInput({ ...editsInput, title: e.target.value })} />
                </Typography>
              ) : (
                <Typography variant="h5">Title: {selectedItem.title}</Typography>
              )}
              {inEditMode ? (
                <Typography variant="h5">
                  Notes: <input value={editsInput.notes} onChange={(e) => setEditsInput({ ...editsInput, notes: e.target.value })} />
                </Typography>
              ) : (
                <Typography variant="body1">Notes: {selectedItem.notes}</Typography>
              )}
              <Typography variant="body1">Location: {selectedItem.location}</Typography>
              <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
                {inEditMode ? (
                  <Chip
                    icon={<CreateIcon />}
                    label="Save"
                    onClick={() => handleUpdate(editsInput)}
                    color="primary"
                    style={{ cursor: "pointer" }}
                  />
                ) : (
                  <Chip
                    icon={<CreateIcon />}
                    label="Edit"
                    onClick={() => handleEdit(selectedItem)}
                    style={{ cursor: "pointer" }}
                  />
                )}
                <Chip
                  icon={<DeleteForeverIcon />}
                  label="Delete"
                  onClick={() => openDeleteConfirmModal(selectedItem)}
                  color="error"
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
          <Button onClick={() => deleteEvidence(selectedItem.id)} color="error">Delete</Button>
          <Button onClick={() => setDeleteModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
      {/* Public Confirmation Modal */}
      <Dialog open={publicConfirmModalOpen} onClose={() => setConfirmModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to change the visibility of this evidence?</Typography>
          <Button onClick={() => { toggleIsPublic(selectedItem.id); setConfirmModalOpen(false); }} color="primary">Confirm</Button>
          <Button onClick={() => setConfirmModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
      {/* All Public/Private Confirmation Modal */}
      <Dialog open={allPublicConfirmModalOpen} onClose={() => setAllPublicConfirmModalOpen(false)}>
        <DialogContent>
          <Typography>Are you sure you want to change the visibility of all evidence to {makeAllPublic ? 'public' : 'private'}?</Typography>
          <Button onClick={() => handleMakeAllPublic(makeAllPublic)} color="primary">Confirm</Button>
          <Button onClick={() => setAllPublicConfirmModalOpen(false)}>Cancel</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export default AdminPage;