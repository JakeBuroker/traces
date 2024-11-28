import React, { useState, useRef } from "react";
import {
    Grid,
    Typography,
} from '@mui/material';
import GalleryEnlargeModal from './GalleryEnlargeModal';

/**
 * Component to render each evidence item in the gallery.
 * @param {Object} item - The evidence item to render.
 * @returns JSX.Element
 */
export const GalleryPageEvCard = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);
    const audioRef = useRef(null); // Reference to the audio element

    // Determine if the item is a video, audio, or note
    const isVideo = item.media_type === 3;
    const isAudio = item.media_type === 4;
    const isNote = item.media_type === 1;

    // Styles for notes with ellipsis
    const noteStyles = {
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        display: '-webkit-box',
        WebkitLineClamp: 6, // Number of lines you want to display
        WebkitBoxOrient: 'vertical',
        fontSize: '1rem', // Larger font size
    };

    return (
        <>
            <Grid item xs={12} sm={6} md={4} sx={{ justifyItems: 'center' }} >
                <div onClick={() => setIsOpen(true)} style={{ width: '250px', height: '357px' }}>
                    {/* // TODO audio not rendering correctly */}
                    {isAudio && (
                        <>
                            <div style={{ width: "55%", alignSelf: "center", marginBottom: "-40px" }}>
                                <img
                                    src='./audio_placeholder.jpeg'
                                    alt="Audio Placeholder"
                                    style={{ width: "100%", height: 130, objectFit: "cover" }}
                                />
                            </div>
                            <audio
                                ref={audioRef}
                                src={item.aws_url}
                                controls
                                style={{ width: "60%", alignSelf: "center", marginTop: "10px" }}
                            />
                        </>
                    )}
                    {isVideo && (
                        <video
                            src={item.aws_url}
                            controls
                            style={{
                                height: 200,
                                minWidth: 250,
                                objectFit: "cover",
                                alignSelf: "center",
                            }}
                        />
                    )}
                    {!isAudio && !isVideo && !isNote && (
                        <img
                            src={item.aws_url}
                            alt={item.title}
                            style={{
                                height: 200,
                                minWidth: '250px',
                                objectFit: "cover",
                                alignSelf: "center",
                            }}
                        />
                    )}
                    <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={noteStyles}
                    >
                        {item.notes}
                    </Typography>
                </div>
            </Grid>

            <GalleryEnlargeModal isOpen={isOpen} setIsOpen={setIsOpen} selectedItem={item} />
        </>
    );
};