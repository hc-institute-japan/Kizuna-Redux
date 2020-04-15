import { ActionType } from "../types";
import { AUTHENTICATE } from "./actionTypes";

const initialState = {
  isAuthenticated: false,
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case AUTHENTICATE:
      return Object.assign({}, state, {
        isAuthenticated: true,
      });

    default:
      return state;
  }
};
