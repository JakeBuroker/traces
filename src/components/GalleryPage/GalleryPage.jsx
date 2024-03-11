import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryPageEvCard } from './GalleryPageEvCard';
import { Grid, Pagination, Stack, Typography } from '@mui/material';

function GalleryPage() {
    const [publicEvidence, setPublicEvidence] = useState([])
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchAllPublic()
    }, [])

    const handleChange = (event, value) => {
        setPage(value);
    };

    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                // console.log("Gallery page", response.data);
                for (let item of response.data) {
                    
                }

                setPublicEvidence(response.data)
            }).catch(err => {
                console.log(err);
            })
    }

    // I want four per page. When I get the response data, I need a way to split it up by page.
    // Calculate the number of keys needed (Math.ceil(lengh / #of entries per page)) 
    // Create a key for each page and push items into the array for each one
    // Map for the specific page.

    // ! RETURN
    if (publicEvidence.length === 0) {
        return <h2 style={{ textAlign: 'center' }}>All Evidence To Be Declassified Soon.</h2>
    } else {

        return (
            <div>
                <h2>Here is the Gallery</h2>
                {/* <p>This is where the media will be rendered</p> */}
                <Grid container spacing={2} justifyContent="center">
                    {publicEvidence.map((item) => (
                        <GalleryPageEvCard item={item} key={item.id} />
                    ))}
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    <Stack spacing={2}>
                        <Typography>Page: {page}</Typography>
                        <Pagination count={Math.ceil(publicEvidence.length / 4)} page={page} onChange={handleChange} />
                    </Stack>
                </Grid>
            </div>
        )
    }
}
export default GalleryPage;