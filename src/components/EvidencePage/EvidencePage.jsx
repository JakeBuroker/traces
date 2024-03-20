import React, { useState, useEffect } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import "./EvidencePage.css";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import EvidenceCard from "../EvidenceCard/EvidenceCard";
import MediaFilter from "../MediaFilter/MediaFilter";

// Functional component for the evidence page
function EvidencePage() {
  // Redux hooks for dispatching actions and selecting state
  const dispatch = useDispatch();
  const evidence = useSelector((store) => store.evidence);
  const [selectedMediaType, setSelectedCategories] = useState("all");

  // Effect to fetch evidence data when evidence length changes
  useEffect(() => {
    fetchEvidence();
  }, [evidence.length]);

  // Function to fetch evidence data from the server
  const fetchEvidence = () => {
    axios
      .get("/api/evidence")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not fetch evidence!");
      });
  };

  // Function to handle media filter change
  const handleMediaFilterChange = (event, newMediaType) => {
    setSelectedCategories(newMediaType);
  };

  // Function to get filtered evidence based on selected media type
  const getFilteredEvidence = () => {
    if (selectedMediaType === "all") {
      return evidence;
    }
    const mediaTypeInt = parseInt(selectedMediaType, 10);
    return evidence.filter((item) => item.media_type === mediaTypeInt);
  };

  // Return statement for rendering the evidence page
  return (
    <main>
      {/* Media filter component */}
      <div style={{ display: "flex", flexDirection: "column", padding: "65px 0 10px 0" }}>
        <MediaFilter
          selectedMediaType={selectedMediaType}
          onMediaTypeChange={handleMediaFilterChange}
        />
      </div>
      <div>
        {/* Evidence upload button component */}
        <EvidenceUploadButton />
        {/* Grid layout for displaying evidence cards */}
        <Grid container spacing={2} justifyContent="center">
          {/* Mapping through filtered evidence and rendering evidence cards */}
          {getFilteredEvidence().map((item) => (
            <Grid item key={item.id}>
              <EvidenceCard
                item={item}
                fetchEvidence={fetchEvidence}
              />
            </Grid>
          ))}
        </Grid>
      </div>
    </main>
  );
}

export default EvidencePage;
