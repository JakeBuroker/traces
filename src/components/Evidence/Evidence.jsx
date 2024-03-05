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
import CreateIcon from "@mui/icons-material/Create";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import "./Evidence.css";

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

  return (
    <main>
      <div className="container">
        <Grid container spacing={2} justifyContent="center">
          {evidence.map((item) => (
            <Grid key={item.id} item xs={12} sm={8} md={6} lg={3}>
              <Card className="item-card">
                <CardMedia
                  component="img"
                  src={item.aws_url}
                  className="item-image"
                  onClick={() => openModal(item)}
                />
                <CardContent className="item-content">
                  <Typography
                    variant="h4"
                    className="item-title"
                    style={{
                      position: "absolute",
                      top: "20px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      width: "auto",
                    }}
                  >
                    {item.title}
                  </Typography>
                  <Typography variant="body2" className="notes" style={{fontSize:'19px'}}>
                    {item.notes}
                  </Typography>

                  <Typography
                    variant="body2"
                    className="location"
                    style={{
                      textAlign: "center",
                      marginRight: "25.5px",
                    }}
                  >
                    Location: {item.location}
                  </Typography>
                  <div
                    style={{
                      position: "absolute",
                      bottom: "37.5px",
                      left: "50%",
                      transform: "translateX(-50%)",
                      display: "flex",
                      gap: "20px",
                    }}
                  >
                    <Chip
                      icon={<CreateIcon />}
                      label="Edit"
                      onClick={() => handleEdit(selectedItem)}
                      style={{
                        cursor: "pointer",
                        width: "90px",
                        height: "40px",
                        fontSize: "20px",
                      }}
                    />
                    <Chip
                      icon={<DeleteForeverIcon />}
                      label="Delete"
                      onClick={() => handleDelete(selectedItem)}
                      style={{
                        cursor: "pointer",
                        width: "110px",
                        height: "40px",
                        fontSize: "20px",
                      }}
                    />
                  </div>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog
        open={detailsModalOpen}
        onClose={detailsModalClose}
        fullWidth={true}
        maxWidth="md"
        className="details-dialog"
      >
        <DialogContent className="dialog-content">
          {selectedItem && (
            <div>
              <img
                src={`images/${selectedItem.aws_key}`}
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
        </DialogContent>
      </Dialog>
    </main>
  );
}

export default EvidencePage;
