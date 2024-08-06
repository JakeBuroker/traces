import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import EvidenceCard from "../EvidenceCard/EvidenceCard";
import MediaFilter from "../MediaFilter/MediaFilter";
import "./EvidencePage.css";

const EvidencePage = () => {
  const dispatch = useDispatch();
  const evidence = useSelector((store) => store.evidence);
  const [selectedMediaType, setSelectedCategories] = useState("all");

  const fetchEvidence = useCallback(() => {
    axios
      .get("/api/evidence")
      .then((response) => {
        dispatch({ type: "SET_EVIDENCE", payload: response.data });
      })
      .catch((error) => {
        console.error(error);
        alert("Could not load evidence!");
      });
  }, [dispatch]);

  useEffect(() => {
    fetchEvidence();
  }, [fetchEvidence]);

  const handleMediaFilterChange = (event, newMediaType) => {
    setSelectedCategories(newMediaType);
  };

  const getFilteredEvidence = () => {
    if (selectedMediaType === "all") {
      return evidence;
    }
    const mediaTypeInt = parseInt(selectedMediaType, 10);
    return evidence.filter((item) => item.media_type === mediaTypeInt);
  };

  return (
    <main>
      <div style={{ display: "flex", flexDirection: "column", padding: "65px 0 10px 0" }}>
        <MediaFilter
          selectedMediaType={selectedMediaType}
          onMediaTypeChange={handleMediaFilterChange}
        />
      </div>
      <div>
        <EvidenceUploadButton />
        <Grid container spacing={2} justifyContent="center">
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
};

export default EvidencePage;
