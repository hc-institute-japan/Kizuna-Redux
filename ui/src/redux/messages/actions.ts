import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { LOG_MESSAGE } from "./actionTypes";
import { Message } from "../../utils/types";

export const logMessage = (message: Message) => (
    dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: LOG_MESSAGE, message });
