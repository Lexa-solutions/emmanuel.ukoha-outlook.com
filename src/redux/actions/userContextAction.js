import * as types from "./actionTypes";

export function intializeUser(userContext) {
  return { type: types.INITIALIZE_USER, userContext };
}
