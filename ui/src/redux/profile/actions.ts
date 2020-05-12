import { SET_PROFILE } from "./actionTypes";

import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
interface Profile {
  profile: {
    [key: string]: any;
  };
}

export const setProfile = (profile: Profile) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) =>
  dispatch({
    type: SET_PROFILE,
    profile,
  });
