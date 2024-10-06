import React, { useState } from 'react';
import axios from 'axios';
import { Card, CardContent, Typography, Grid, Box } from '@mui/material';
import { Link } from '@mui/joy';
import { visuallyHidden } from '@mui/utils'
import EvidenceDetailsModal from '../EvidenceDetailsModal/EvidenceDetailsModal';

const EvidenceCard = ({ item, fetchEvidence }) => {
  const [isOpen, setIsOpen] = useState(false);

  const isVideo = (mediaType) => mediaType === 3;
  const isAudio = (mediaType) => mediaType === 4;
  const hasMedia = (mediaType) => mediaType;

  const editEvidence = (id, formData) => {
    axios
      .put(`/api/evidence/update/${id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      .then(() => {
        fetchEvidence();
        setIsOpen(false);
      })
      .catch((error) => console.error('Error updating evidence:', error));
  };

  const deleteEvidence = (itemId) => {
    axios
      .delete(`/api/evidence/delete/${itemId}`)
      .then(() => {
        fetchEvidence();
        setIsOpen(false);
      })
      .catch((error) => console.error('Error deleting evidence:', error));
  };

  const onClose = () => {
    setIsOpen(false);
  };

  const formatLongTitles = (title) => {
    if (title?.length > 8) {
      return title.split('').filter((word, i) => i < 8).join('') + ' ...';
    }
    return title;
  };

  const acceptedMedia = (typeNo) => {
    if (typeNo === 2) {
      return 'image/*';
    } else if (typeNo === 3) {
      return 'video/*';
    } else if (typeNo === 4) {
      return 'audio/*';
    }
  };

  const renderImageForMediaItem = ({ media_type, aws_url, title }) => {
    if (isAudio(media_type)) {
      return (
        <video
          src={aws_url}
          controls
          style={{ height: 160, width: 160, objectFit: 'cover', margin: '5px 0' }}
          poster='./audio_placeholder.jpeg'
        />
      );
    } else if (isVideo(media_type)) {
      return (
        <video
          src={aws_url}
          controls
          style={{ height: 160, width: 160, objectFit: 'cover', margin: '5px 0' }}
          poster='./video_placeholder.jpeg'
        />
      );
    } else if (media_type === 2) {
      return (
        <img
          src={aws_url}
          alt={title}
          style={{ height: 160, width: 160, objectFit: 'cover', margin: '5px 0' }}
        />
      );
    }
  };

  return (
    <Grid item xs={2} sm={2} md={6} lg={4}>
      <Card
        className='item-card'
        sx={{
          display: 'flex',
          flexDirection: 'column',
          position: 'relative',
          boxShadow: 10,
          width: '170px',
          height: '230px',
        }}
      // onClick={() => setIsOpen(true)}
      >
        {item.is_public && (
          <Box
            sx={{
              position: 'absolute',
              top: 8,
              right: 8,
              backgroundColor: 'rgba(0,0,0,0.5)',
              color: 'white',
              padding: '2px 4px',
              borderRadius: '4px',
              fontSize: '12px',
            }}
          >
            Public
          </Box>
        )}
        <CardContent>
          {hasMedia(item.media_type) && renderImageForMediaItem(item)}
          <Typography variant='h5' component='div' sx={{ textAlign: 'center', fontSize: '20px' }}>
            <Link
              overlay
              underline='none'
              sx={{ color: 'text.primary' }}
              // href='_blank'
              component={'button'}
              onClick={() => setIsOpen(true)}
            ><Box sx={visuallyHidden}>Click for more information about this piece of evidence:</Box>
              {formatLongTitles(item.title)}
            </Link>
          </Typography>

        </CardContent>
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
