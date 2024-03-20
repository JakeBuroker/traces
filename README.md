## Overview

Traces is a companion app designed to enhance the interactive play experience by allowing users to upload various types of evidence, including video, audio, pictures, and notes, as directed by a private investigator. The app facilitates the seamless integration of user-generated content into the narrative, creating an immersive and engaging storytelling experience.

## Prerequisites

Before you get started, make sure you have the following software installed on your computer:

- [Node.js](https://nodejs.org/en)
- [PostgreSQL](https://www.postgresql.org)
- [Nodemon](https://nodemon.io)


Features
Upload Multiple Types of Evidence: Users can upload video, audio, pictures, and notes to provide evidence relevant to the investigation.

Guided Experience: The app provides guidance from a private investigator, directing users on when and what type of evidence to upload to progress through the interactive play experience.

Secure Storage: Uploaded evidence is securely stored using Amazon S3, ensuring the confidentiality and integrity of user data.

User Authentication: Traces includes user authentication functionality to ensure that only authorized individuals can access and participate in the interactive play experience.

## Technologies Used

Traces is built using a combination of frontend and backend technologies. Here are the key technologies and dependencies:

Frontend:

React
Material-UI
Emotion
Axios
React Router DOM
Redux
Redux Saga
Styled Components
SweetAlert2
Backend:

Node.js
Express.js
AWS SDK for S3
Multer
Passport.js (for authentication)
PostgreSQL (pg)
Cookie-session
bcryptjs
dotenv
Development Tools:

Vite (for frontend build)
Nodemon (for automatic server restart)
Vitest (for testing)
Heroku (deployment)

## Create Database and Tables

Create a new database called `traces` and create the `user`, `media`, and `evidence` table:


[Database](/database.sql)

## Getting Started

To run the Traces app locally, follow these steps:

1. Clone the repository: git clone <traces>
2. Navigate to the project directory: cd <traces>
3. Install dependencies: npm install
4. Create a .env file in the root directory and configure environment variables as needed.
5. Start the server: npm run server
6. Start the client: npm run client
7. Open your web browser and navigate to http://localhost:3000 to access the Traces app.

While you're in your new `.env` file, take the time to replace `superDuperSecret` with some long random string like `25POUbVtx6RKVNWszd9ERB9Bb6` to keep your application secure. Here's a site that can help you: [Password Generator Plus](https://passwordsgenerator.net). If you don't do this step, create a secret with less than eight characters, or leave it as `superDuperSecret`, you will get a warning. Here is an example of what the .env file should look like

```
BUCKET_NAME='Whatever your bucket name is'
BUCKET_REGION='Whatever your region is'
ACCESS_KEY='This will be the access key that is given via AWS'
SECRET_ACCESS_KEY='This is the access key to access the server'
SERVER_SESSION_SECRET='This can be what ever you need the passcode to be and can be generated with the link above'

```
1. BUCKET_NAME: This variable holds the name of the S3 bucket where your application will store data such as files, images, or any other type of objects.

2. BUCKET_REGION: This variable specifies the region in which your S3 bucket is located. AWS services are region-specific, so you need to specify the region where your bucket resides.

3. ACCESS_KEY: This is the access key ID provided by AWS. It is used to authenticate requests made to AWS services like S3. Access keys are used in combination with secret access keys.

4. SECRET_ACCESS_KEY: This is the secret access key provided by AWS. Like the access key ID, it is used for authentication purposes. Secret access keys should be kept confidential and not shared publicly.

5. SERVER_SESSION_SECRET: This variable is used to set a session secret for your server. It's a cryptographic key used to sign the session ID cookie and helps prevent unauthorized access to session data. It should be a random, long, and complex string.

- Start postgres if not running already by using opening up the [Postgres.app](https://postgresapp.com), or if using [Homebrew](https://brew.sh) you can use the command `brew services start postgresql`.
- Run `npm run server` to start the server.
- Run `npm run client` to start the client.
- Navigate to `localhost:5173`.


## Production Build

Before pushing to Heroku, run `npm run build` in terminal. This will create a build folder that contains the code Heroku will be pointed at. You can test this build by typing `npm start`. Keep in mind that `npm start` will let you preview the production build but will **not** auto update.

- Start postgres if not running already by using opening up the [Postgres.app](https://postgresapp.com), or if using [Homebrew](https://brew.sh) you can use the command `brew services start postgresql`.
- Run `npm start`.
- Navigate to `localhost:5173`.

## Lay of the Land

There are a few videos linked below that show a walkthrough the client and sever setup to help acclimatize to the boilerplate. Please take some time to watch the videos in order to get a better understanding of what the boilerplate is like.



Directory Structure:

- `src/` contains the React application.
- `public/` contains static assets for the client-side.
- `build/` after you build the project, contains the transpiled code from `src/` and `public/` that will be viewed on the production site.
- `server/` contains the Express App.

This code is also heavily commented. We recommend reading through the comments, getting a lay of the land, and becoming comfortable with how the code works before you start making too many changes. If you're wondering where to start, consider reading through component file comments in the following order:

- src/components
  - App/App
  - Footer/Footer
  - Nav/Nav
  - AboutPage/AboutPage
  - InfoPage/InfoPage
  - UserPage/UserPage
  - LoginPage/LoginPage
  - RegisterPage/RegisterPage
  - LogOutButton/LogOutButton
  - ProtectedRoute/ProtectedRoute

## Update Documentation

Customize this ReadMe and the code comments as the code is updated and evolves.
