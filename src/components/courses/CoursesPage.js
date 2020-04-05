import React from "react";
import { connect } from "react-redux";
import * as courseActions from "../../redux/actions/courseActions";
import * as authorActions from "../../redux/actions/authorActions";
import PropTypes from "prop-types";
import { bindActionCreators } from "redux";
import CourseList from "./CourseList";
import Spinner from "../common/Spinner";
import { toast } from "react-toastify";

class CoursesPage extends React.Component {
  state = {
    isLoading: true
  };
  componentDidMount() {
    const { actions, authors, courses } = this.props;
    if (courses.length === 0) {
      actions
        .loadCourses()
        .then(() => this.setState({ isLoading: false }))
        .catch(error => {
          alert("Load courses failed -- " + error.message);
        });
    }
    if (authors.length === 0) {
      actions.loadAuthors().catch(error => {
        alert("Load authors failed -- " + error.message);
      });
    }
  }

  // handleOnDeleteClick = course => {
  //   toast.success("Course Deleted");
  //   this.props.actions.deleteCourse(course).catch(error => {
  //     toast.error("Delete failed: " + error.message, { autoClose: false });
  //   });
  // };

  //using async/await
  handleOnDeleteClick = async course => {
    toast.success("Course Deleted");

    try {
      this.props.actions.deleteCourse(course);
    } catch (error) {
      toast.error("Delete failed: " + error.message, { autoClose: false });
    }
  };

  render() {
    return (
      <>
        <h2>Courses</h2>

        {this.props.loading ? (
          <Spinner />
        ) : (
          <>
            <button
              className="btn btn-primary btn-md mt-2 mb-4"
              onClick={() => this.props.history.push("/course")}
            >
              Add Course
            </button>

            <CourseList
              courses={this.props.courses}
              onDeleteClick={this.handleOnDeleteClick}
            />
          </>
        )}
      </>
    );
  }
}

CoursesPage.propTypes = {
  actions: PropTypes.object.isRequired,
  courses: PropTypes.array.isRequired,
  authors: PropTypes.array.isRequired,
  history: PropTypes.object.isRequired,
  loading: PropTypes.bool.isRequired
};

//mapStateToProps accepts to params: state and ownProps
function mapStateToProps(state) {
  return {
    courses:
      state.authors.length === 0
        ? []
        : state.courses.map(course => ({
            ...course,
            authorName: state.authors.find(a => a.id === course.authorId).name
          })),
    authors: state.authors,
    loading: state.apiCallsInProgress > 0
  };
}

function mapDispatchToProps(dispatch) {
  //this approach is called manual mapping
  // return {
  //   createCourse: course => dispatch(courseActions.createCourse(course))
  // };
  return {
    actions: {
      loadCourses: bindActionCreators(courseActions.loadCourses, dispatch),
      loadAuthors: bindActionCreators(authorActions.loadAuthors, dispatch),
      deleteCourse: bindActionCreators(courseActions.deleteCourse, dispatch)
    }
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(CoursesPage);
