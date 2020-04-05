import { combineReducers } from "redux";
import courses from "./courseReducer";
import authors from "./authorReducer";
import userContext from "./userContextReducer";
import apiCallsInProgress from "./apiStatusReducer";

const rootReducer = combineReducers({
  courses: courses,
  authors,
  apiCallsInProgress,
  userContext
});

export default rootReducer;
