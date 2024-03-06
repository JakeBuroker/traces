import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useHistory } from 'react-router-dom';

function GalleryPage() {

    const [publicEvidence, setPublicEvidence] = useState([])

    useEffect(() => {
        fetchAllPublic()
    }, [])

    const fetchAllPublic = () => {
        axios.get('/api/evidence/public')
        .then(response => {
            console.log(response.data);
        }).catch(err => {
            console.log(err);
        })
    }

    return (
        <div>
            <h2>Here is the Gallery</h2>
            {/* <p>This is where the media will be rendered</p> */}

        </div>
    )
}
export default GalleryPage;