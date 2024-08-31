import React, { useEffect } from "react";
import "./App.css";
import {
  HashRouter as Router,
  Redirect,
  Route,
  Switch,
} from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Nav from "../Nav/Nav";

import ProtectedRoute from "../ProtectedRoute/ProtectedRoute";
import UserPage from "../UserPage/UserPage";
import LandingPage from "../LandingPage/LandingPage";
import LoginPage from "../LoginPage/LoginPage";
import RegisterPage from "../RegisterPage/RegisterPage";
import AdminPage from "../AdminPage/AdminPage";
import GalleryPage from "../GalleryPage/GalleryPage";
import EvidenceUpload from "../EvidenceUploadPage/EvidenceUploadPage";
import EvidencePage from "../EvidencePage/EvidencePage";
import HelpPage from "../HelpPage/HelpPage";
import EvidenceDetails from "../EvidenceDetailsPage/EvidenceDetailsPage";
import ResetPasswordCodeConfPage from "../ResetPasswordCodeConfPage/ResetPasswordCodeConfPage"
import ResetPasswordEmailPage from "../ResetPasswordEmailPage/ResetPasswordEmailPage"
import ResetPasswordPage from "../ResetPasswordPage/ResetPasswordPage"
function App() {
  const dispatch = useDispatch();
  const user = useSelector((store) => store.user);

  useEffect(() => {
    dispatch({ type: "FETCH_USER" });
  }, [dispatch]);

  return (
    <Router>
      <div >
        <Nav />
        <Switch>
          {/* Visiting localhost:5173 will redirect to localhost:5173/home */}
          <Redirect exact from="/" to="/home" />

          {/* Visiting localhost:5173/about will show the about page. */}
          <Route
            // shows GalleryPage at all times (logged in or not)
            exact
            path="/gallery"
          >
            <GalleryPage />
          </Route>

          {/* For protected routes, the view could show one of several things on the same route.
            Visiting localhost:5173/user will show the UserPage if the user is logged in.
            If the user is not logged in, the ProtectedRoute will show the LoginPage (component).
            Even though it seems like they are different pages, the user is always on localhost:5173/user */}
          <ProtectedRoute
            // logged in shows UserPage else shows LoginPage
            exact
            path="/user"
          >
            <UserPage />
          </ProtectedRoute>

          <ProtectedRoute
            // logged in shows EvidenceUpload else shows LoginPage
            exact
            path="/evidenceupload"
          >
            <EvidenceUpload />
          </ProtectedRoute>


        <ProtectedRoute exact path="/admin">
            {user.role === 1 ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the login page
              <AdminPage />
            )}
         </ProtectedRoute>
         <Route
            exact
            path="/reset-password-code"
          >
            <ResetPasswordCodeConfPage />
          </Route>
         <Route
            exact
            path="/reset-password-email"
          >
            <ResetPasswordEmailPage />
          </Route>
          <Route
            exact
            path="/reset-password-page"
          >
            <ResetPasswordPage />
          </Route>

          <ProtectedRoute
            // logged in shows Adminpage
            exact
            path="/evidence-details"
          >
            <EvidenceDetails />
          </ProtectedRoute>

          <Route exact path="/login">
            {user.id ? (
              // If the user is already logged in,
              // redirect to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the login page
              <LoginPage />
            )}
          </Route>

          <Route exact path="/registration">
            {user.id ? (
              // If the user is already logged in,
              // redirect them to the /user page
              <Redirect to="/user" />
            ) : (
              // Otherwise, show the registration page
              <RegisterPage />
            )}
          </Route>

          <Route exact path="/home">
            {/* Otherwise, show the Landing page */}
            <LandingPage />
          </Route>

          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/Evidence"
          >
            <EvidencePage />
          </Route>
          <Route
            // shows AboutPage at all times (logged in or not)
            exact
            path="/help"
          >
            <HelpPage />
          </Route>

          {/* If none of the other routes matched, we will show a 404. */}
          <Route>
            <h1 style={{marginTop: '100px'}}>404</h1>
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;