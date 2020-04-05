import React, { useState, useEffect } from "react";
import Axios from "axios";

const Public = () => {
  const [message, setMessage] = useState("");

  // useEffect(() => {
  //   fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}/public`)
  //     .then(response => {
  //       if (response.ok) return response.json();
  //       throw new Error("Network response was not ok");
  //     })
  //     .then(response => {
  //       setMessage(response.message);
  //     })
  //     .catch(err => {
  //       setMessage(err.message);
  //     });
  // }, []);

  useEffect(() => {
    Axios.get("http://localhost:3001/public")
      .then(response => {
        setMessage(response.data.message);
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
