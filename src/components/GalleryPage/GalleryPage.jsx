import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryPageEvCard } from './GalleryPageEvCard';
import MediaFilter from '../MediaFilter/MediaFilter';
import { Grid, Pagination, Stack } from '@mui/material';

function GalleryPage() {
    const [publicEvidence, setPublicEvidence] = useState([]);
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(0); // Initialize as 0
    const [selectedMediaType, setSelectedCategories] = useState("all");

    // Fetch public evidence on component mount
    useEffect(() => {
        fetchAllPublic();
    }, []);

    // Function to handle page change in pagination
    const handleChange = (_event, value) => {
        setPage(value);
    };

    // Function to handle media filter change
    const handleMediaFilterChange = (_event, newMediaType) => {
        setSelectedCategories(newMediaType);
    };

    // Function to filter evidence based on selected media type and paginate results
    const getFilteredEvidence = () => {
        if (selectedMediaType === 'all') {
            return paginateResults(publicEvidence);
        }
        const mediaTypeInt = parseInt(selectedMediaType, 10);
        return paginateResults(publicEvidence.filter(item => item.media_type === mediaTypeInt));
    };

    // Function to paginate results
    const paginateResults = (array) => {
        const itemsPerPage = 15; // 2 rows of 4
        let pages = {};
        
        array.forEach((item, index) => {
            const page = Math.floor(index / itemsPerPage) + 1;
            if (!pages[`page${page}`]) {
                pages[`page${page}`] = [];
            }
            pages[`page${page}`].push(item);
        });

        return pages;
    }

    // Function to fetch all public evidence
    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                setPublicEvidence(response.data);
                setPageCount(Math.ceil(response.data.length / 8)); // Adjust for 2 rows of 4
            }).catch(err => {
                console.error(err);
            });
    }

    if (publicEvidence.length === 0) {
        return (<div><h2 style={{ textAlign: 'center', paddingTop: '120px', color: '#000000' }}>All Evidence To Be Declassified Soon.</h2></div>);
    } else {
        return (
            <div style={{ padding: "65px 0" }}>
                <MediaFilter selectedMediaType={selectedMediaType} onMediaTypeChange={handleMediaFilterChange} />
                <Grid container spacing={2} justifyContent='flex-start' style={{ padding: "20px" }}>
                    {getFilteredEvidence()[`page${page}`]?.map((item) => (
                        <GalleryPageEvCard item={item} key={item.id} />
                    ))}
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    <Stack spacing={2} style={{ padding: '50px' }}>
                        <Pagination count={pageCount} page={page} onChange={handleChange} />
                    </Stack>
                </Grid>
            </div>
        );
    }
}

export default GalleryPage;
