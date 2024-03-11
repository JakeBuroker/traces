import React from 'react';
import {text} from './AboutPage.text'

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  const headers = text.english.aboutPageHeaders
  const body = text.english.aboutPageBodies

  const style = {margin: '10px auto'}
  return (
    <div className="container">
      <div>
        {/* About Traces */}
        <h2 style={style}>{headers.header1}</h2>
        <img src="/street.jpg" alt="An image of a busy street." style={{borderRadius: '5px'}}/>
        <p style={style}>{body.body1}</p>
        {/* About the Artists */}
        <h2 style={style}>{headers.header2}</h2>
        {/* Rachel */}
        <h3 style={style}>{headers.header3}</h3>
        <p style={style}>{body.body2}</p>
        {/* Ivan */}
        <h3 style={style}>{headers.header4}</h3>
        <p style={style}>{body.body3}</p>
      </div>
    </div>
  );
}

export default AboutPage;
