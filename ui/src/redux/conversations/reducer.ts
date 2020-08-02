import { getTimestamp } from "../../utils/helpers";
import { ActionType } from "../../utils/types";
import { LOG_MESSAGE } from "./actionTypes";
import { Conversation } from "../../utils/types/";

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
      const i = conversations.findIndex(
        (conversation: Conversation) => conversation.name === name
      );
      if (i >= 0)
        conversations[i].messages.push(action.conversation.messages[0]);
      else conversations.push(action.conversation);
      return { ...state, conversations };
    default:
      return state;
  }
};
