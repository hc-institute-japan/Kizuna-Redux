import { getTimestamp } from "../../utils/helpers";
import { ActionType } from "../../utils/types";
import { LOG_MESSAGE } from "./actionTypes";
import { Conversation } from "../../utils/types/";

const initialState: {conversations: Array<Conversation>} = {
  conversations: [],
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case LOG_MESSAGE:
      const { name } = action.conversation;
      const i = state.conversations.findIndex(
        (conversation: Conversation) => conversation.name === name
      );
      if (i >= 0)
        state.conversations[i].messages.push(action.conversation.messages[0]);
      else state.conversations.push(action.conversation);
      return { ...state };
    default:
      return state;
  }
};
