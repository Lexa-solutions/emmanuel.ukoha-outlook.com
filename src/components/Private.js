import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Auth/AuthContext";

const Public = () => {
  const [message, setMessage] = useState("");
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}/private`, {
      headers: { Authorization: `Bearer ${auth.getAccessToken()}` }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok");
      })
      .then(response => {
        setMessage(response.message);
      })
      .catch(err => {
        setMessage(err.message);
      });
  }, []);

  return (
    <div>
      <h2>{message} </h2>
    </div>
  );
};

export default Public;
