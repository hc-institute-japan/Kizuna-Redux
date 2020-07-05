import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Conversation } from "../../utils/types";
import { RootState } from "../reducers";
import { LOG_MESSAGE } from "./actionTypes";

export const logMessage = (conversation: Conversation) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: LOG_MESSAGE, conversation });

export const getMessages = (name: string) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>,
  getState: () => RootState
) => {
  const {
    conversations: { conversations },
  } = getState();
  return [
    ...(conversations.find((conversation) => name === conversation.name)
      ?.messages || []),
  ];
};
