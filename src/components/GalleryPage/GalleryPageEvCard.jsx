import React, { useState } from "react";
import { DateTime } from "luxon";
import {
    Avatar,
    Grid,
    Card,
    Typography,
    CardMedia,
    CardContent,
    Chip
} from '@mui/material';
import GalleryEnlargeModal from './GalleryEnlargeModal';

export const GalleryPageEvCard = ({ item }) => {
    const [isOpen, setIsOpen] = useState(false);

    // Determine if the item is a video or audio
    const isVideo = item.media_type === 3;
    const isAudio = item.media_type === 4;

    return (
        <>
            <Grid key={item.id} item xs={12} sm={10} md={6} lg={3}>
                <Card
                    className="item-card"
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        position: "relative",
                        height: 450,
                    }}
                >
                    <Typography
                        variant="h5"
                        component="div"
                        sx={{ textAlign: "center", margin: "16px 0" }}
                    >
                        {item.title}
                    </Typography>
                    {/* Conditional rendering based on media_type */}
                    {isAudio ? (
                        <audio
                            src={item.aws_url}
                            controls
                            style={{
                                width: "80%",
                                alignSelf: "center",
                            }}
                            onClick={() => setIsOpen(true)}
                        />
                    ) : isVideo ? (
                        <video
                            src={item.aws_url}
                            controls
                            style={{
                                height: 160,
                                width: "80%",
                                objectFit: "cover",
                                alignSelf: "center",
                            }}
                            onClick={() => setIsOpen(true)}
                        />
                    ) : (
                        <CardMedia
                            component="img"
                            src={item.aws_url}
                            className="item-image"
                            onClick={() => setIsOpen(true)}
                            sx={{
                                height: 160,
                                width: "80%",
                                objectFit: "cover",
                                alignSelf: "center",
                            }}
                        />
                    )}
                    <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                        <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ marginBottom: 2 }}
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
                    <Avatar alt={item.username} /> 
                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", bottom: 10, left: 10 }}
                    >
                        {DateTime.fromISO(item.date_posted).toLocaleString(
                            DateTime.DATETIME_MED
                        )}
                    </Typography>
                    <Typography
                        variant="body2"
                        sx={{ position: "absolute", bottom: 10, right: 10 }}
                    >
                        {item.location}
                    </Typography>
                </Card>
            </Grid>

            <GalleryEnlargeModal isOpen={isOpen} setIsOpen={setIsOpen} selectedItem={item} />
        </>
    );
};
