import * as types from "../actions/actionTypes";
import initialState from "./initialState";

export default function authReducer(state = initialState.userContext, action) {
  if (action.type === types.INITIALIZE_USER) {
    return { ...action.userContext };
  }

  return state;
}
