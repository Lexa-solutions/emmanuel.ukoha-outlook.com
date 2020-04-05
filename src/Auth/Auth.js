import auth0 from "auth0-js";
import store from "../redux/store";
import { intializeUser } from "../redux/actions/userContextAction";

let userContext = {
  idToken: "",
  accessToken: "",
  scopes: "",
  expiresAt: "",
  profile: {}
};

const REDIRECT_ON_LOGIN = "redirect_on_login";

export default class Auth {
  constructor(history) {
    this.userProfile = null;
    this.history = history;
    this.requestedScopes = "openid profile email read:courses";
    this.state = store.getState();

    this.auth0 = new auth0.WebAuth({
      domain: process.env.REACT_APP_AUTH0_DOMAIN,
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      redirectUri: process.env.REACT_APP_AUTH0_CALLBACK_URL,
      audience: process.env.REACT_APP_AUTH0_AUDIENCE,
      responseType: "token id_token",
      scope: this.requestedScopes
    });
  }

  login = () => {
    localStorage.setItem(
      REDIRECT_ON_LOGIN,
      JSON.stringify(this.history.location)
    );
    this.auth0.authorize();
  };

  handleAuthentication = () => {
    this.auth0.parseHash((err, authResult) => {
      if (authResult && authResult.idToken && authResult.accessToken) {
        //set session and redirect
        this.setSessionAndRedirect(authResult);
      } else if (err) {
        this.history.push("/");
        alert(`Error: ${err.error}. Check the console for further details`);
        console.log(err);
      }
    });
  };

  setSessionAndRedirect = authResult => {
    userContext.idToken = authResult.idToken;
    userContext.accessToken = authResult.accessToken;
    userContext.scopes = authResult.scope || this.requestedScopes || "";
    userContext.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    this.getProfile(authResult.accessToken, (profile, error) => {
      userContext.profile = profile;
      console.log(error);
      //Update the store with user credentials
      store.dispatch(intializeUser(userContext));
      const redirectLocation =
        localStorage.getItem(REDIRECT_ON_LOGIN) === "undefined"
          ? "/"
          : JSON.parse(localStorage.getItem(REDIRECT_ON_LOGIN));

      this.scheduleTokenRenewal();
      this.history.push(redirectLocation);
      localStorage.removeItem(REDIRECT_ON_LOGIN);
    });
  };

  setSession = authResult => {
    userContext.idToken = authResult.idToken;
    userContext.accessToken = authResult.accessToken;
    userContext.scopes = authResult.scope || this.requestedScopes || "";
    userContext.expiresAt = authResult.expiresIn * 1000 + new Date().getTime();

    this.getProfile(authResult.accessToken, (profile, error) => {
      userContext.profile = profile;
      console.log(error);
      //Update the store with user credentials
      store.dispatch(intializeUser(userContext));
      this.scheduleTokenRenewal();
      this.history.push(this.history.location);
    });
  };

  isAuthenticated = () => {
    return new Date().getTime() < this.state.userContext.expiresAt;
  };

  logout = () => {
    this.auth0.logout({
      clientID: process.env.REACT_APP_AUTH0_CLIENTID,
      returnTo: "http://localhost:3000"
    });
  };

  getAccessToken = () => {
    if (!this.state.userContext.accessToken) {
      // throw new Error("No access token found");
      console.log("No access token found");
    }
    return this.state.userContext.accessToken;
  };

  getProfile = (accessToken, cb) => {
    // if (this.userProfile) return cb(this.userProfile);
    this.auth0.client.userInfo(accessToken, (err, profile) => {
      if (profile) {
        cb(profile, err);
      }
    });
  };

  userHasScopes = scopes => {
    const grantedScopes = (this.state.userContext.scopes || "").split(" ");

    return scopes.every(scope => grantedScopes.includes(scope));
  };

  renewToken(cb) {
    this.auth0.checkSession({}, (err, result) => {
      if (err) {
        console.log(`Error: ${err.error} - ${err.error_description}.`);
      } else {
        this.setSession(result);
      }

      if (cb) cb(err, result);
    });
  }

  scheduleTokenRenewal() {
    const delay = userContext.expiresAt - Date.now();
    if (delay > 0) setTimeout(() => this.renewToken(), delay);
  }
}
