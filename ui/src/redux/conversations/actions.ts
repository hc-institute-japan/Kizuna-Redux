import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Conversation } from "../../utils/types";
import { LOG_MESSAGE } from "./actionTypes";

export const logMessage = (conversation: Conversation) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: LOG_MESSAGE, conversation });
