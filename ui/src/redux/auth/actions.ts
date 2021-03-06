import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AUTHENTICATE } from "./actionTypes";
import { SET_PROFILE } from "../profile/actionTypes";
import { Profile } from "../../utils/types";

export const authenticate = (profile: Profile) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => {
  if (profile && profile.username) {
    new Promise((resolve, reject) => {
      resolve(
        dispatch({
          type: SET_PROFILE,
          profile,
        })
      );
    }).then(() => {
      dispatch({
        type: AUTHENTICATE,
        agentAddress: profile.id,
      });
    });
  }
};
