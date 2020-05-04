import { ActionType } from "../types";
import * as actions from "./actionTypes";

const initialState = {
  firstName: "Neilson",
  lastName: "Gardose",
  username: "nkpgardose",
  email: "nkgardose@gmail.com",
  profilePicture: "https://data.whicdn.com/images/326480125/original.jpg",
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    default:
      return state;
  }
};
