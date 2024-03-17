import axios from 'axios';
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Grid
} from '@mui/material';
import EvidenceDetailsModal from '../EvidenceDetailsModal/EvidenceDetailsModal';

const EvidenceCard = ({ item, fetchEvidence }) => {
  const [isOpen, setIsOpen] = useState(false)
  const isVideo = (mediaType) => mediaType === 3;
  const isAudio = (mediaType) => mediaType === 4; // Check if the media type indicates audio
  const hasMedia = (mediaType) => mediaType === 2 || mediaType === 3 || mediaType === 4; // Include audio in the media check


  const editEvidence = (id, formData) => {
    axios
      .put(`/api/evidence/update/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(() => fetchEvidence())
      .catch((error) => console.error("Error updating evidence:", error));
  };

  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
        onClose()
      })
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  const onClose = () => {
    setIsOpen(false)
  }

  const formatLongTitles = (title) => {
    if (title?.length > 8) { // returns the first word and elipses
      return title.split(' ').filter((word, i) => i < 1).toSpliced(1, 0, '. . .').join(' ')
    }
    return title
  }

  const acceptedMedia = (typeNo) => {
    // console.log("inside acceptionsmedia");
    if (typeNo === 2) {
      return 'image/*'
    } else if (typeNo === 3) {
      return 'video/*'
    } else if (typeNo === 4) {
      return 'audio/*'
    }
  }

  return (
    <Grid item xs={2} sm={2} md={6} lg={4}>
      <Card
        className="item-card"
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "relative",
          boxShadow: 10,
          width: '170px',
          height: '230px'
        }}
        onClick={() => setIsOpen(true)}>
        {hasMedia(item.media_type) && (
          isAudio(item.media_type) ? (
            // Render an audio element for audio files
            <video
              src={item.aws_url}
              controls
              style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
              poster='./audio_placeholder.jpeg'
            />
          ) : isVideo(item.media_type) ? (
            // Render a video element for video files
            <video
              src={item.aws_url}
              controls
              style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
              poster='./video_placeholder.jpeg'
            />
          ) : (
            // Render an img element for image files
            <img
              src={item.aws_url}
              alt={item.title}
              style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
            />
          )
        )}
        <Typography variant="h5" component="div" sx={{ textAlign: "center", fontFamily: 'Caveat', fontSize: '30px' }}>
          {formatLongTitles(item.title)}
        </Typography>
      </Card>

      <EvidenceDetailsModal
        selectedItem={item}
        isOpen={isOpen}
        onClose={onClose}
        editEvidence={editEvidence}
        deleteEvidence={deleteEvidence}
        acceptedMedia={acceptedMedia}
      />
    </Grid>
  );
};

export default EvidenceCard;
