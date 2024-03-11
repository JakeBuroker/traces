import React from 'react';
import { Dialog, DialogContent, Typography, Chip } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';

const EvidenceDetailsModal = ({ selectedItem, isOpen, onClose, onEdit, onDelete }) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
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
                onClick={() => onEdit(selectedItem)}
                style={{ cursor: "pointer" }}
              />
              <Chip
                icon={<DeleteForeverIcon />}
                label="Delete"
                onClick={() => onDelete(selectedItem)}
                style={{ cursor: "pointer" }}
              />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default EvidenceDetailsModal;
