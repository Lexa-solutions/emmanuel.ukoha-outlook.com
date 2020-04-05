import React, { useEffect, useContext } from "react";
import PropTypes from "prop-types";
import AuthContext from "../Auth/AuthContext";

const Callback = props => {
  const auth = useContext(AuthContext);

  useEffect(() => {
    if (/access_token|id_token|error|/.test(props.location.hash)) {
      auth.handleAuthentication();
    } else {
      throw new Error("Access token is invalid");
    }
  });

  return <h1>Loading...</h1>;
};

Callback.propTypes = {
  location: PropTypes.object.isRequired
};
export default Callback;
