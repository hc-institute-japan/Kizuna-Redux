import { combineReducers } from "redux";
import AuthReducer from "./auth/reducer";
import ProfileReducer from "./profile/reducer";
import ContactsReducer from "./contacts/reducer";
import ConversationsReducer from "./conversations/reducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
  contacts: ContactsReducer,
  conversations: ConversationsReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
