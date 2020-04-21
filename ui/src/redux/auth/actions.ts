import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AUTHENTICATE } from "./actionTypes";

export const authenticate = () => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) =>
  dispatch({
    type: AUTHENTICATE,
  });
