import React, { useState, useEffect, useContext } from "react";
import AuthContext from "../Auth/AuthContext";

const Courses = () => {
  const [courses, setCourses] = useState([]);
  const auth = useContext(AuthContext);

  useEffect(() => {
    fetch(`${process.env.REACT_APP_AUTH0_AUDIENCE}/course`, {
      headers: { Authorization: `Bearer ${auth.getAccessToken()}` }
    })
      .then(response => {
        if (response.ok) return response.json();
        throw new Error("Network response was not ok");
      })
      .then(response => {
        setCourses(response.courses);
      })
      .catch(err => {
        setCourses([err.message]);
      });
  }, []);

  return (
    <div>
      <ul>
        {courses.map(course => {
          return <li key={course.id}> {course.title} </li>;
        })}
      </ul>
    </div>
  );
};

export default Courses;
