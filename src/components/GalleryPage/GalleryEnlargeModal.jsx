import React from 'react';
import { Dialog, DialogContent, Typography } from '@mui/material';

const GalleryEnlargeModal = ({ selectedItem, isOpen, setIsOpen }) => {
    const onClose = () => setIsOpen(false);

    // Function to determine and render content based on media type
    const renderContent = () => {
        const { media_type, aws_url, notes } = selectedItem;

        switch(media_type) {
            case 1: // Notes only, no media to display
                return <Typography style={{ marginTop: "20px" }}>{notes}</Typography>;
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
                        <img src={aws_url} alt="Gallery item" style={{ maxHeight: "500px", maxWidth: "100%", objectFit: "contain" }} />
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