import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryPageEvCard } from './GalleryPageEvCard';
import { Grid,} from '@mui/material';

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
                        <GalleryPageEvCard item={item} key={item.id}/>
                    ))}
                </Grid>

            </div>
        )
    }
}
export default GalleryPage;