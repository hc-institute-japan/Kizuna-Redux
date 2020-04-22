import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { AUTHENTICATE } from "./actionTypes";

export const authenticate = (agentAddress: String) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => {
  if (agentAddress)
    dispatch({
      type: AUTHENTICATE,
      agentAddress,
    });
};
