import axios from 'axios';
import React, { useState } from 'react';
import {
  Card,
  Typography,
  Grid
} from '@mui/material';
import EvidenceDetailsModal from '../EvidenceDetailsModal/EvidenceDetailsModal';

const EvidenceCard = ({ item, fetchEvidence }) => {
  const [isOpen, setIsOpen] = useState(false);

  // Function to check if the media type is video
  const isVideo = (mediaType) => mediaType === 3;

  // Function to check if the media type is audio
  const isAudio = (mediaType) => mediaType === 4;

  // Function to check if the evidence has any media attached
  const hasMedia = (mediaType) => mediaType;

  // Function to edit evidence
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

  // Function to delete evidence
  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
        onClose();
      })
      .catch((error) => console.error("Error deleting evidence:", error));
  };

  // Function to close the modal
  const onClose = () => {
    setIsOpen(false);
  };

  // Function to format long titles
  const formatLongTitles = (title) => {
    if (title?.length > 8) {
      return title.split('').filter((word, i) => i < 8).join('') + ' ...';
    }
    return title;
  };

  // Function to get accepted media types
  const acceptedMedia = (typeNo) => {
    if (typeNo === 2) {
      return 'image/*';
    } else if (typeNo === 3) {
      return 'video/*';
    } else if (typeNo === 4) {
      return 'audio/*';
    }
  };

  // Function to render media item
  const renderImageForMediaItem = ({ media_type, aws_url, title }) => {
    if (isAudio(media_type)) {
      return (
        <video
          src={aws_url}
          controls
          style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
          poster='./audio_placeholder.jpeg'
        />
      );
    } else if (isVideo(media_type)) {
      return (
        <video
          src={aws_url}
          controls
          style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
          poster='./video_placeholder.jpeg'
        />
      );
    } else if (media_type === 2) {
      return (
        <img
          src={aws_url}
          alt={title}
          style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
        />
      );
    }
  };

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
        {hasMedia(item.media_type) && renderImageForMediaItem(item)}
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
