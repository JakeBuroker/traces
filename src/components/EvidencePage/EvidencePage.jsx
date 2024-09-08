import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import Grid from "@mui/material/Grid";
import EvidenceUploadButton from "../EvidenceUploadRender/EvidenceUploadButton";
import EvidenceCard from "../EvidenceCard/EvidenceCard";
import MediaFilter from "../MediaFilter/MediaFilter";
import "./EvidencePage.css";
import { evidencePageText } from "./EvidencePage.text";
import { Typography } from "@mui/material";

const styles = {
  mediaFilter: { display: "flex", flexDirection: "column", padding: "65px 0 10px 0" },
  welcome: {textAlign: 'center', marginBottom: '10px', color: '#383838'},
  body1: { textAlign: 'center', color: '#383838', maxWidth: '500px', padding: '0 10px'},
}

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
      <div style={styles.mediaFilter}>
        <MediaFilter
          selectedMediaType={selectedMediaType}
          onMediaTypeChange={handleMediaFilterChange}
        />
      </div>
      <div>
        <EvidenceUploadButton />
        <Grid container spacing={2} justifyContent="center">
          {evidence.length === 0 &&
            <Grid item key={"key"}>
              <Typography variant="h5" sx={styles.welcome}>{evidencePageText.welcome}</Typography>
              <Typography sx={styles.body1} variant="body1">{evidencePageText.instructions}</Typography>
            </Grid>
          }
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
