import React, { useState, useRef } from "react";
import { DateTime } from "luxon";
import {
    Avatar,
    Grid,
    Card,
    Typography,
    CardContent,
    CardMedia,
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
            {/* <Grid key={item.id} item xs={12} sm={10} md={6} lg={3}>
                <Card
                    className="item-card"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        height: 450,
                    }}
                    onClick={() => setIsOpen(true)}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center", margin: "12px 0" }}
                    >
                        {item.title}
                    </Typography>
                    <hr style={{ width: '100%', alignSelf: 'center' }} />
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
                            <hr style={{ width: '100%', alignSelf: 'center' }} />
                        </>
                    )}
                    {isVideo && (
                        <>
                            <video
                                src={item.aws_url}
                                controls
                                style={{
                                    height: 160,
                                    width: "80%",
                                    objectFit: "cover",
                                    alignSelf: "center",
                                }}
                            />
                            <hr style={{ width: '100%', alignSelf: 'center' }} />
                        </>
                    )}
                    {!isAudio && !isVideo && !isNote && (
                        <>
                            <img
                                src={item.aws_url}
                                alt={item.title}
                                style={{
                                    height: 160,
                                    width: "80%",
                                    objectFit: "cover",
                                    alignSelf: "center",
                                }}
                            />
                            <hr style={{ width: '100%', alignSelf: 'center' }} />
                        </>
                    )}
                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={noteStyles} // Apply custom styles for ellipsis and larger font
                        >
                            {item.notes}
                        </Typography>
                    </CardContent>
                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", bottom: 30, left: 10 }}
                    >
                        Submitted by: {item.username}
                    </Typography>
                    <Avatar
                        alt={item.username}
                        src={item.avatar_AWS_URL || "./altered_avi2.jpeg"}
                        sizes="small"
                        sx={{ position: 'absolute', bottom: 55, left: 11 }}
                    />
                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", bottom: 10, left: 10 }}
                    >
                        {DateTime.fromISO(item.date_posted).toLocaleString(DateTime.DATETIME_MED)}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", bottom: 10, right: 10 }}
                    >
                        {item.location}
                    </Typography>
                </Card>
            </Grid> */}
            <Grid item xs={4} sx={{ justifyItems: 'center' }} >
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