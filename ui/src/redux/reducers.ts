import { combineReducers } from "redux";
import AuthReducer from "./auth/reducer";
import ProfileReducer from "./profile/reducer";

const rootReducer = combineReducers({
  auth: AuthReducer,
  profile: ProfileReducer,
});

export default rootReducer;

export type RootState = ReturnType<typeof rootReducer>;
