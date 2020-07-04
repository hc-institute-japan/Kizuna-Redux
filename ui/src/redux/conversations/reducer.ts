import { getTimestamp } from "../../utils/helpers";
import { ActionType } from "../../utils/types";
import { LOG_MESSAGE } from "./actionTypes";

const user = "seulgi";

const initialState = {
  conversations: [
    {
      name: "Nicolas Alexander",
      messages: [
        {
          sender: "Nicolas Alexander",
          payload: "hey",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload: "Yoyo!",
          createdAt: getTimestamp(),
        },
        {
          sender: "Nicolas Alexander",
          payload: "Long time!",
          createdAt: getTimestamp(),
        },
        {
          sender: "Nicolas Alexander",
          payload:
            "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload:
            "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload: "I heard that this pandemic is a hoax ",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload: "Wanna hang soon? ",
          createdAt: getTimestamp(),
        },
      ],
    },
    {
      name: "Bob",
      messages: [
        {
          sender: "Bob",
          payload: "hey",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload: "Yoyo!",
          createdAt: getTimestamp(),
        },
        {
          sender: "Bob",
          payload: "Long time!",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload:
            "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
          createdAt: getTimestamp(),
        },
      ],
    },
    {
      name: "Charlie",
      messages: [
        {
          sender: "Charlie",
          payload: "hey",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload: "Yoyo!",
          createdAt: getTimestamp(),
        },
        {
          sender: "Charlie",
          payload: "Long time!",
          createdAt: getTimestamp(),
        },
        {
          sender: user,
          payload:
            "Wanna hang soon? I heard that this pandemic is a hoax and we don't have to live like a caveman anymore! jkjk",
          createdAt: getTimestamp(),
        },
      ],
    },
  ],
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case LOG_MESSAGE:
      const { name } = action.conversation;
      const i = state.conversations.findIndex(
        (conversation) => conversation.name === name
      );
      if (i >= 0)
        state.conversations[i].messages.push(action.conversation.messages[0]);
      else state.conversations.push(action.conversation);

      return { ...state };
    default:
      return state;
  }
};
