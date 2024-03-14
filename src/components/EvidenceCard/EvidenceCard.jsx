import React, { useState } from 'react';
import { Card, CardContent, Typography, Chip, Grid } from '@mui/material';
import CreateIcon from '@mui/icons-material/Create';
import DeleteForeverIcon from '@mui/icons-material/DeleteForever';
import { DateTime } from 'luxon';
import EvidenceDetailsModal from '../EvidenceDetailsModal/EvidenceDetailsModal';

const EvidenceCard = ({ item, onEdit, onDelete, onOpenModal, fetchEvidence }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isVideo = (mediaType) => mediaType === 3;
  const isAudio = (mediaType) => mediaType === 4; // Check if the media type indicates audio
  const hasMedia = (mediaType) => mediaType === 2 || mediaType === 3 || mediaType === 4; // Include audio in the media check

  const onClose = () => {
    setIsOpen(false)
  }

  return (
    <Grid item xs={12} sm={8} md={6} lg={4}>
      <Card className="item-card" sx={{ display: "flex", flexDirection: "column", position: "relative", boxShadow: 10 }}>
        <Typography variant="h5" component="div" sx={{ textAlign: "center", margin: "16px 0" }}>
          {item.title}
        </Typography>
        {hasMedia(item.media_type) && (
          isAudio(item.media_type) ? (
            // Render an audio element for audio files
            <audio
              src={item.aws_url}
              controls
              style={{ width: "100%" }}
            />
          ) : isVideo(item.media_type) ? (
            // Render a video element for video files
            <video
              src={item.aws_url}
              controls
              style={{ height: 160, width: "100%", objectFit: "cover" }}
              onClick={() => setIsOpen(true)}
            />
          ) : (
            // Render an img element for image files
            <img
              src={item.aws_url}
              alt={item.title}
              style={{ height: 160, width: "100%", objectFit: "cover" }}
              onClick={() => setIsOpen(true)}
            />
          )
        )}
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="body2" color="text.secondary" sx={{ marginBottom: 2 }}>
            {item.notes}
          </Typography>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <Chip icon={<CreateIcon />} label="Edit" onClick={() => onEdit(item)} />
            <Chip icon={<DeleteForeverIcon />} label="Delete" onClick={() => onDelete(item)} />
          </div>
        </CardContent>
        <Typography variant="body2" sx={{ position: "absolute", bottom: 10, left: 10 }}>
          {DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED)}
        </Typography>
        <Typography variant="body2" sx={{ position: "absolute", bottom: 10, right: 10 }}>
          {item.location}
        </Typography>
      </Card>
      <EvidenceDetailsModal
        selectedItem={item}
        isOpen={isOpen}
        onClose={onClose}
        fetchEvidence={fetchEvidence}
         />
    </Grid>
  );
};

export default EvidenceCard;
