import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { LOG_MESSAGE } from "./actionTypes";
import { Message } from "../types";

export const sendMessage = (message: Message) => (
    dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: LOG_MESSAGE, message });
