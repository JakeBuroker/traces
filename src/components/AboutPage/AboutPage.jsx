import React from 'react';

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  return (
    <div className="container">
      <div>
        <h2>About the Play</h2>
        {/* This is where the image will go */}
        <p>This project involves participants who are equipped with synchronized audio devices, following a narrator's prompts to track the journey of an individual (an actor) as she moves through various real public locations across the city. Participants are instructed to document their observations through audio, video, and photo recordings.</p>
        <h2>About the Artist</h2>
        <p></p>
      </div>
    </div>
  );
}

export default AboutPage;
