import { ActionType } from "../../utils/types";
import * as actions from "./actionTypes";

const initialState = {
  isAuthenticated: false,
  agentAddress: null,
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case actions.AUTHENTICATE:
      return Object.assign({}, state, {
        isAuthenticated: true,
        agentAddress: action.agentAddress,
      });
    default:
      return state;
  }
};
