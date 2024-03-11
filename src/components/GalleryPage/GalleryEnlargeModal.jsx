import React from 'react';
import { Dialog, DialogContent, Typography, Chip } from '@mui/material';

const GalleryEnlargeModal = ({ selectedItem, isOpen, setIsOpen, }) => {
    const onClose = () => {
        setIsOpen(false)
    }

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
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default GalleryEnlargeModal;
