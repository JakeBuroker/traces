import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryPageEvCard } from './GalleryPageEvCard';
import MediaFilter from '../MediaFilter/MediaFilter';
import { Grid } from '@mui/material';

function GalleryPage() {
    const [publicEvidence, setPublicEvidence] = useState([]);
    const [selectedMediaType, setSelectedCategories] = useState("all");

    // Fetch public evidence on component mount
    useEffect(() => {
        fetchAllPublic();
    }, []);

    // Function to handle media filter change
    const handleMediaFilterChange = (_event, newMediaType) => {
        setSelectedCategories(newMediaType);
    };

    // Function to filter evidence based on selected media type and paginate results
    const getFilteredEvidence = () => {
        if (selectedMediaType === 'all') {
            return publicEvidence
        }
        const mediaTypeInt = parseInt(selectedMediaType, 10);
        return publicEvidence.filter(item => item.media_type === mediaTypeInt)
    };

    // Function to fetch all public evidence
    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                setPublicEvidence(response.data);
            }).catch(err => {
                console.error(err);
            });
    }

    if (publicEvidence.length === 0) {
        return (<div><h2 style={{ textAlign: 'center', paddingTop: '120px', color: '#000000' }}>Loading evidence . . .</h2></div>);
    } else {
        return (
            <div style={{ padding: "65px 0" }}>
                <MediaFilter selectedMediaType={selectedMediaType} onMediaTypeChange={handleMediaFilterChange} />
                <Grid container spacing={2} justifyContent='flex-start' style={{ padding: "20px" }}>
                    {getFilteredEvidence().map(item => {
                        return (
                            <GalleryPageEvCard item={item} key={item.id} />
                        )
                    })}
                </Grid>
            </div>
        );
    }
}

export default GalleryPage;
