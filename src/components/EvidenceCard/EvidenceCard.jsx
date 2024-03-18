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
  const hasMedia = (mediaType) => mediaType; // Include audio in the media check


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
      return title.split('').filter((word, i) => i < 8).toSpliced(8, 0, ' ...').join('')
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

  const renderImageForMediaItem = ({media_type, aws_url, title}) => {
    if (isAudio(media_type)) {
      return ( // Render an audio element for audio files
      <video
        src={aws_url}
        controls
        style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
        poster='./audio_placeholder.jpeg'
      />)
    } else if (isVideo(media_type)) {
      return (
        // Render a video element for video files
        <video
        src={aws_url}
        controls
        style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
        poster='./video_placeholder.jpeg'
      />
      )
    } else if (media_type === 2) {
      return (
        <img
        src={aws_url}
        alt={title}
        style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
      />
      )
    }
    // console.log('rendering...', item);
    // return (
    //   <img
    //   src='./text_placeholder.jpeg'
    //   alt={'A circle with a T in it as a placeholder.'}
    //   style={{ height: 160, width: 160, objectFit: "cover", margin: '5px 0' }}
    // />
    // <p>{title}</p>
    // )
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
