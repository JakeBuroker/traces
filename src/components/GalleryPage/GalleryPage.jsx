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

    useEffect(() => {
        fetchAllPublic();
    }, []);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const handleMediaFilterChange = (event, newMediaType) => {
        setSelectedCategories(newMediaType);
    };

    const getFilteredEvidence = () => {
        if (selectedMediaType === 'all') {
            return paginateResults(publicEvidence);
        }
        const mediaTypeInt = parseInt(selectedMediaType, 10);
        return paginateResults(publicEvidence.filter(item => item.media_type === mediaTypeInt));
    };

    // Adjusted to fit 2 rows of 4 cards each
    const paginateResults = (array) => {
        const itemsPerPage = 8; // 2 rows of 4
        let pages = {};
        let currentPage = 1;
        
        array.forEach((item, index) => {
            const page = Math.floor(index / itemsPerPage) + 1;
            if (!pages[`page${page}`]) {
                pages[`page${page}`] = [];
            }
            pages[`page${page}`].push(item);
        });

        return pages;
    }

    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                setPublicEvidence(response.data);
                setPageCount(Math.ceil(response.data.length / 8)); // Adjust for 2 rows of 4
            }).catch(err => {
                console.log(err);
            });
    }

    if (publicEvidence.length === 0) {
        return (<div><h2 style={{ textAlign: 'center', paddingTop: '120px' }}>All Evidence To Be Declassified Soon.</h2></div>);
    } else {
        return (
            <div style={{ padding: "65px 0" }}>
                {/* <h2 style={{ leftPadding: "65px", padding: "5px" }} >Evidence Gallery: Declassified</h2> */}
                <MediaFilter selectedMediaType={selectedMediaType} onMediaTypeChange={handleMediaFilterChange} />
                <Grid container spacing={2} justifyContent="center" style={{ padding: "20px" }}>
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