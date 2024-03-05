import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import Chip from "@mui/material/Chip";
import { DialogContent, Dialog } from "@mui/material";
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import './Evidence.css'

function EvidencePage() {
  const evidence = useSelector((store) => store.evidence);
  const [selectedItem, setSelectedItem] = useState(null);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const dispatch = useDispatch();

  useEffect(() => {
    fetchEvidence();
  }, []);

  const fetchEvidence = () => {
    axios
      .get("/api/evidence")
      .then((response) => {
        console.log("Evidence: ", response.data);
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not fetch evidence! It is broken");
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

  return (
    <main>
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {evidence.map((item) => (
            <Grid key={item.id} item xs={12} sm={8} md={6} lg={4}>
              <Card className="item-card">
                <CardMedia
                  component="img"
                  src={item.aws_url}
                  className="item-image"
                  onClick={() => openModal(item)}
                />
                <CardContent className="item-content">
                  <Typography variant="h5" className="item-title">
                    {item.title}
                  </Typography>
                  <div className="item-actions">
                    {/* Place for Edit and Delete actions */}
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog open={detailsModalOpen} onClose={detailsModalClose} fullWidth={true} maxWidth="md" className="details-dialog">
  <DialogContent className="dialog-content">
    {selectedItem && (
      <div style={{ display: 'flex', width: '100%' }}>
        <div className="selected-item-image-container">
          <img
            // src={selectedItem.imageUrl}
            alt="item"
            className="selected-item-image"
          />
        </div>
        <div className="selected-item-details">
          <Typography variant="h5">
            {selectedItem.title}
          </Typography>
          <Typography variant="body1">
            {selectedItem.notes} 
          </Typography>
          <Typography variant="body1">
            Location: {selectedItem.location} 
          </Typography>
          <div className="selected-item-actions">
            <Chip
              icon={<CreateIcon />}
              label="Edit"
              onClick={() => handleEdit(selectedItem)}
              style={{ cursor: 'pointer' }}
            />
            <Chip
              icon={<DeleteForeverIcon />}
              label="Delete"
              onClick={() => handleDelete(selectedItem)}
              style={{ cursor: 'pointer' }}
            />
          </div>
        </div>
      </div>
    )}
  </DialogContent>
</Dialog>

    </main>
  );
}

export default EvidencePage;
