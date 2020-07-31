import { ActionType } from "../../utils/types";
import * as actions from "./actionTypes";

const initialState = {
  profile: {
    // firstName: "Neilson",
    // lastName: "Gardose",
    // username: "nkpgardose",
    // email: "nkgardose@gmail.com",
    // profilePicture: "https://data.whicdn.com/images/326480125/original.jpg",
  },
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case actions.SET_PROFILE:
      delete action.profile.__typename;
      return {
        ...state,
        profile: {
          ...action.profile,
        },
      };

    default:
      return state;
  }
};
