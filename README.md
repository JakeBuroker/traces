# Traces 🕵️‍♂️

Welcome to Traces, an evidence management mobile web app developed for 'TRACES,' an immersive play by the artist and playwright Rachel Jendrzejewski, in collaboration with Wax Factory and The Walker Art Center. This app enriches the interactive play experience by seamlessly integrating user-generated content, such as video, audio, pictures, and notes, into the narrative, guided by a private investigator.

## Prerequisites

Ensure you have the latest versions of the following installed:
- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io) (for development)

## User Features

- Users can upload video, audio, pictures, and notes to provide evidence relevant to the investigation.

- Secure Storage: Uploaded evidence is securely stored using Amazon S3, ensuring the confidentiality and integrity of user data.

- Traces includes user authentication functionality to ensure that only authorized individuals can access and participate in the interactive play experience.

## Administrative Features

- Ability to review and curate submissions, ensuring that only relevant and appropriate evidence is included in the public gallery.

- Administrators can edit or delete evidence as needed to maintain the integrity and quality of the content.

- Choose to release all submitted evidence to the public, enriching the storytelling experience for all participants.

## Tech Stack

### Frontend

- React
- Material-UI
- Emotion
- Axios
- React Router DOM
- Redux
- Redux Saga
- Styled Components
- SweetAlert2

### Backend

- Node.js
- Express.js
- AWS SDK for S3
- Multer
- Passport.js (for authentication)
- PostgreSQL (pg)
- Cookie-session
- bcryptjs
- dotenv

**Development Tools:** The project uses Vite for the frontend build process, Nodemon for live reloading, Vitest for testing, and is deployed on Heroku.

## Deployed Version

Try out the Traces app live: https://traces-project-b89e883c2e31.herokuapp.com/#/home

## Getting Started Locally

1. Clone the repository: `git clone https://github.com/yourusername/traces.git`
2. Navigate to the project directory: `cd traces`
3. Install dependencies: `npm install`
4. Ensure PostgreSQL is running. Use the provided `database.sql` to set up the database.
5. Create a `.env` file as described below and fill in your details.
6. Start the server: `npm run server`
7. Start the client: `npm run client`
8. Access the app at `http://localhost:3000`.

### .env File Setup

Include the following in your `.env` file, replacing placeholder text with your actual configuration:

```plaintext
BUCKET_NAME=YourS3BucketName
BUCKET_REGION=YourBucketRegion
ACCESS_KEY=YourAWSAccessKey
SECRET
```
Generate a strong SERVER_SESSION_SECRET with [Password Generator Plus](https://passwordsgenerator.net/).

Database Setup
Ensure PostgreSQL is running. Create a traces database and use the provided database.sql script to set up the necessary tables.

### Contact
For any questions, comments, or inquiries regarding this project, please email me at JakeTBuroker@gmail.com, or connect with our team on LinkedIn!

[![Linkedin: JakeBuroker](https://img.shields.io/badge/-JakeBuroker-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/jakeburoker/)](https://www.linkedin.com/in/jakeburoker/)
[![Linkedin: GavinPopken](https://img.shields.io/badge/-GavinPopken-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/gavinpopkenart/)](https://www.linkedin.com/in/gavinpopkenart/)
[![Linkedin: StevieLindsey](https://img.shields.io/badge/-StevieLindsey-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/stevie-lindsey/)](https://www.linkedin.com/in/stevie-lindsey/)
[![Linkedin: MichaelJancik-Kitowski](https://img.shields.io/badge/-MichaelJancik-Kitowski-blue?style=flat-square&logo=Linkedin&logoColor=white&link=https://www.linkedin.com/in/michael-jancik-kitowski-00aa24114/)](https://www.linkedin.com/in/michael-jancik-kitowski/)

