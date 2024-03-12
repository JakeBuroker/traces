import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { GalleryPageEvCard } from './GalleryPageEvCard';
import MediaFilter from '../MediaFilter/MediaFilter';
import { Grid, Pagination, Stack, Typography } from '@mui/material';
import { rowsMetaStateInitializer } from '@mui/x-data-grid/internals';

function GalleryPage() {
    const [publicEvidence, setPublicEvidence] = useState([])
    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(10)
    const [selectedMediaType, setSelectedCategories] = useState("all");

    useEffect(() => {
        fetchAllPublic()
    }, [])

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

    const paginateResults = (array) => {
        let pages = {
            page1: [],
        }
        let currentPage = 1
        for (let item of array) {
            if (pages[`page${currentPage}`].length < 4) {
                pages[`page${currentPage}`].push(item)
            } else {
                currentPage++
                pages = { ...pages, [`page${currentPage}`]: [] }
                pages[`page${currentPage}`].push(item)
            }
        }
        // console.log('Pages:', pages);
        return pages
    }

    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
            .then(response => {
                // const pages = paginateResults(response.data)
                setPublicEvidence(response.data)
                setPageCount(Math.ceil(response.data.length / 4))
            }).catch(err => {
                console.log(err);
            })
    }

    // I want four per page. When I get the response data, I need a way to split it up by page.
    // Calculate the number of keys needed (Math.ceil(lengh / #of entries per page)) 
    // Create a key for each page and push items into the array for each one
    // Map for the specific page.

    // ! RETURN
    if (publicEvidence.page1 && publicEvidence.page1.length === 0) {
        return (<div><h2 style={{ textAlign: 'center' }}>All Evidence To Be Declassified Soon.</h2><p>{JSON.stringify(publicEvidence)}</p></div>)
    } else {

        return (
            <div>
                <MediaFilter
                    selectedMediaType={selectedMediaType}
                    onMediaTypeChange={handleMediaFilterChange} />
                <h2>Here is the Gallery</h2>
                {/* <p>This is where the media will be rendered</p> */}
                <Grid container spacing={2} justifyContent="center">
                    {getFilteredEvidence()[`page${page}`]?.map((item) => (
                        <GalleryPageEvCard item={item} key={item.id} />
                    ))}
                </Grid>
                <Grid container spacing={2} justifyContent="center">
                    <Stack spacing={2} style={{ marginTop: '50px' }}>
                        <Typography>Page: {page}</Typography>
                        <Pagination count={pageCount} page={page} onChange={handleChange} />
                    </Stack>
                </Grid>
            </div>
        )
    }
}
export default GalleryPage;