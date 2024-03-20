import React from 'react';
import { Typography } from '@mui/material';
import {text} from './AboutPage.text'

// This is one of our simplest components
// It doesn't have local state,
// It doesn't dispatch any redux actions or display any part of redux state
// or even care what the redux state is'

function AboutPage() {
  const headers = text.english.aboutPageHeaders
  const body = text.english.aboutPageBodies

  const style = {margin: '60px auto', color: '#f2f2f2'}
  return (
    <div className="container">
      <div>
        {/* About Traces */}
        <Typography variant='h4' style={style}>{headers.header1}</Typography>
        <img src="/street.jpg" alt="An image of a busy street." style={{borderRadius: '5px'}}/>
        <Typography variant='body1' style={style}>{body.body1}</Typography>
        {/* About the Artists */}
        <Typography variant='h4' style={style}>{headers.header2}</Typography>
        {/* Rachel */}
        <Typography variant='h5' style={style}>{headers.header3}</Typography>
        <Typography variant='body1' style={style}>{body.body2}</Typography>
        {/* Ivan */}
        <Typography variant='h5' style={style}>{headers.header4}</Typography>
        <Typography variant='body1' style={style}>{body.body3}</Typography>
      </div>
    </div>
  );
}

export default AboutPage;
