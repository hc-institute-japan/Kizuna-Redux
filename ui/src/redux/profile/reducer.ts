import { ActionType } from "../../utils/types";
import * as actions from "./actionTypes";

interface StateType {
  profile: {
    [key: string]: any;
  };
}

const initialState: StateType = {
  profile: {},
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case actions.SET_PROFILE:
      delete action.profile.__typename;
      return {
        ...state,
        profile: action.profile,
      };
    default:
      return state;
  }
};
