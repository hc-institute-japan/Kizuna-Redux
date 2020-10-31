import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Conversation, Message } from "../../utils/types";
import { RootState } from "../reducers";
import { LOG_MESSAGE, LOG_CONVERSATION } from "./actionTypes";

export const logMessage = (conversation: Conversation) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => {
  dispatch({ type: LOG_MESSAGE, conversation });
};

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

export const updateMessage = (
  message: Message,
  conversation: Conversation | undefined
) => (dispatch: ThunkDispatch<void, {}, AnyAction>) =>
  dispatch({
    type: LOG_CONVERSATION,
    conversation: {
      ...conversation,
      messages:
        conversation?.messages.map((m) =>
          m.address === message.address ? { ...m, payload: message.payload } : m
        ) || [],
    },
  });

export const deleteMessages = (
  messages: Message[],
  conversation: Conversation | undefined
) => (dispatch: ThunkDispatch<void, {}, AnyAction>) =>
  dispatch({
    type: LOG_CONVERSATION,
    conversation: {
      ...conversation,
      messages: conversation?.messages.filter(
        (message) =>
          !messages.map(({ address }) => address).includes(message.address)
      ),
    },
  });
