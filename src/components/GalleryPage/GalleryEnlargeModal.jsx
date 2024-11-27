import React from 'react';
import { Dialog, DialogContent, Grid, Typography, Avatar } from '@mui/material';
import { DateTime } from "luxon";

// Functional component for enlarging gallery items in a modal
const GalleryEnlargeModal = ({ selectedItem, isOpen, setIsOpen }) => {
    // Function to handle modal close
    const onClose = () => setIsOpen(false);

    const NoteType = ({ selectedItem }) => {
        return (
            <Grid container padding={'20px'}>
                <Grid item xs={4} sx={{ alignContent: 'center', justifyItems: 'center', overflow: 'scroll' }}>
                    <Typography variant='body2'>
                        No media to display.
                    </Typography>
                </Grid>
                <Grid item xs={8}>
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center", margin: "12px 0" }}
                    >
                        {selectedItem.title}
                    </Typography>
                    <Typography
                        variant="body2"
                        color="text.secondary"
                    >
                        {selectedItem.notes}
                    </Typography>
                    <div className="user-info" style={{ marginTop: '10px' }}>
                        <Typography
                            variant="body2"
                        >
                            Submitted by: {selectedItem.username}
                        </Typography>
                        <Avatar
                            alt={selectedItem.username}
                            src={selectedItem.avatar_AWS_URL || "./altered_avi2.jpeg"}
                            sizes="small"
                        />
                        <Typography
                            variant="body2"
                        >
                            {DateTime.fromISO(selectedItem.date_posted).toLocaleString(DateTime.DATETIME_MED)}
                        </Typography>
                        <Typography
                            variant="body2"
                        >
                            {selectedItem.location}
                        </Typography>
                    </div>
                </Grid>
            </Grid>
        )
    }

    // Function to determine and render content based on media type
    const renderContent = () => {
        const { media_type, aws_url, notes } = selectedItem;

        switch (media_type) {
            case 1: // Notes only, no media to display
                return <NoteType selectedItem={selectedItem} />
            case 3: // Video
                return (
                    <div style={{ textAlign: "center" }}>
                        <video src={aws_url} controls style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "contain" }} />
                        <Typography style={{ marginTop: "20px" }}>{notes}</Typography>
                    </div>
                );
            case 4: // Audio
                return (
                    <div style={{ textAlign: "center" }}>
                        <audio src={aws_url} controls style={{ maxWidth: "100%" }} />
                        <Typography style={{ marginTop: "20px" }}>{notes}</Typography>
                    </div>
                );
            default: // Images
                return (
                    <div style={{ textAlign: "center" }}>
                        <img src={aws_url} alt="Archive item" style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "contain" }} />
                        <Typography style={{ marginTop: "20px" }}>{notes}</Typography>
                    </div>
                );
        }
    };

    return (
        <Dialog open={isOpen} onClose={onClose} fullWidth maxWidth="md">
            <DialogContent style={{ padding: 0 }}>{selectedItem && renderContent()}</DialogContent>
        </Dialog>
    );
};

export default GalleryEnlargeModal;