import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import PropTypes from "prop-types";
import HomePage from "./home/HomePage";
import AboutPage from "./about/AboutPage";
import Header from "./common/Header";
import PageNotFound from "./PageNotFound";
import CoursesPage from "./courses/CoursesPage";
import { ManageCoursePage } from "./courses/ManageCoursePage";
import { ToastContainer } from "react-toastify";
import Auth from "../Auth/Auth";
import "react-toastify/dist/ReactToastify.css";
import AuthContext from "../Auth/AuthContext";
import Callback from "./Callback";
import Profile from "./Profile";
import Public from "./Public";
import Private from "./Private";
import Courses from "./Courses";

function App(props) {
  const [tokenRenewed, setTokenRenewed] = useState(false);
  const auth = new Auth(props.history);
  const isAuthenticated = auth.isAuthenticated();

  useEffect(() => {
    auth.renewToken(() => {
      setTokenRenewed(true);
    });
  }, [tokenRenewed]);

  if (!tokenRenewed) return "Loading...";
  return (
    <AuthContext.Provider value={auth}>
      <div className="container-fluid">
        <Header />
        <Switch>
          <Route exact path="/" component={HomePage} />
          <Route path="/about" component={AboutPage} />
          <Route path="/courses" component={CoursesPage} />
          <Route path="/course/:slug" component={ManageCoursePage} />
          <Route path="/course" component={ManageCoursePage} />
          <Route path="/callback" component={Callback} />
          <Route path="/profile" component={Profile} />
          <Route path="/public" component={Public} />
          <Route path="/private" component={Private} />
          <Route
            path="/coursess"
            render={(props) =>
              isAuthenticated && auth.userHasScopes(["read:courses"]) ? (
                <Courses {...props} />
              ) : (
                auth.login()
              )
            }
          />
          <Route component={PageNotFound} />
        </Switch>
        <ToastContainer autoClose={3000} hideProgressBar />
      </div>
    </AuthContext.Provider>
  );
}

App.propTypes = {
  history: PropTypes.object.isRequired,
};

export default App;
