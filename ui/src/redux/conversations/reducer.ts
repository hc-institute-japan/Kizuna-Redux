import { ActionType } from "../../utils/types";
import { Conversation } from "../../utils/types/";
import { LOG_MESSAGE, LOG_CONVERSATION } from "./actionTypes";

const initialState: { conversations: Array<Conversation> } = {
  conversations: [],
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case LOG_MESSAGE:
      const { name } = action.conversation;
      let conversations = [...state.conversations];
      // this depends on username being unique. What would be better to compare is
      // the instanceId but currently difficult bc of how p2pinstance bug in p2pcontainer.

      const messages = conversations.find(
        (conversation: Conversation) => conversation.name === name
      )?.messages;
      if (messages) messages.push(action.conversation.messages[0]);
      else conversations.push(action.conversation);

      return { ...state, conversations };
    case LOG_CONVERSATION:
      return {
        ...state,
        conversations: state.conversations.map((conversation) =>
          conversation.name === action.conversation.name
            ? action.conversation
            : conversation
        ),
      };
    default:
      return state;
  }
};
