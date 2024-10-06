import React from 'react';
import { Typography, ToggleButtonGroup, ToggleButton } from '@mui/material';
import { visuallyHidden } from '@mui/utils'

function MediaFilter({ selectedMediaType, onMediaTypeChange }) {
  return (
    <div style={{
      padding: "20px",
      display: "flex",
      justifyContent: "center",
      flexWrap: "wrap",
      gap: "10px",
      alignItems: "center",
      
    }}>
      <label htmlFor="filterButtons" style={visuallyHidden}>Filter Evidence</label>
      <ToggleButtonGroup
        id='filterButtons'
        value={selectedMediaType}
        exclusive
        onChange={onMediaTypeChange}
        sx={{ display: "flex", flexDirection: "row", bgcolor: 'white'}}
      >
        <ToggleButton key="all" value="all"><b>All</b></ToggleButton>
        <ToggleButton key="1" value="1"><b>Notes</b></ToggleButton>
        <ToggleButton key="2" value="2"><b>Photos</b></ToggleButton>
        <ToggleButton key="3" value="3"><b>Videos</b></ToggleButton>
        <ToggleButton key="4" value="4"><b>Audio</b></ToggleButton>
      </ToggleButtonGroup>
    </div>
  );
}

export default MediaFilter;
