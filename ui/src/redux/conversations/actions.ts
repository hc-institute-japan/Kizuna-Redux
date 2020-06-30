import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { LOG_MESSAGE } from "./actionTypes";
import { Conversation } from "../../utils/types";

export const logMessage = (conversation: Conversation) => (
    dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: LOG_MESSAGE, conversation });
