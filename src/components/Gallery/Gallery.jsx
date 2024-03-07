import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';
import { DateTime } from "luxon";

import { Grid, Card, Typography, CardMedia, CardContent, Chip } from '@mui/material';

function GalleryPage() {

    const [publicEvidence, setPublicEvidence] = useState([])

    useEffect(() => {
        fetchAllPublic()
    }, [])

    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                // console.log("Gallery page", response.data);
                setPublicEvidence(response.data)
            }).catch(err => {
                console.log(err);
            })
    }

    return (
        <div>
            <h2>Here is the Gallery</h2>
            {/* <p>This is where the media will be rendered</p> */}
            <Grid container spacing={2} justifyContent="center">
                {publicEvidence.map((item) => (
                    <Grid key={item.id} item xs={12} sm={8} md={6} lg={3}>
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
                            <CardMedia
                                component="img"
                                src={item.aws_url}
                                className="item-image"
                                // onClick={() => openModal(item)}
                                sx={{
                                    height: 160,
                                    width: "80%",
                                    objectFit: "cover",
                                    alignSelf: "center",
                                }}
                            />
                            <CardContent sx={{ flexGrow: 1, width: "100%" }}>
                                <Typography
                                    variant="body2"
                                    color="text.secondary"
                                    sx={{ marginBottom: 2 }}
                                >
                                    {item.notes}
                                </Typography>
                                {/* <div
                                    style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: "20px",
                                    }}
                                >
                                    <Chip
                                        icon={<CreateIcon />}
                                        label="Edit"
                                        onClick={() => handleEdit(item)}
                                    />
                                    <Chip
                                        icon={<DeleteForeverIcon />}
                                        label="Delete"
                                        onClick={() => openDeleteConfirmation(item)}
                                    />
                                </div> */}
                            </CardContent>
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
                ))}
            </Grid>

        </div>
    )
}
export default GalleryPage;