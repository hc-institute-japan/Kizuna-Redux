import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Profile } from "../../utils/types";
import { SET_BLOCKED, SET_CONTACTS } from "./actionTypes";

export const setContacts = (contacts: Array<Profile>) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_CONTACTS, contacts });

export const setBlocked = (blocked: Array<Profile>) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_BLOCKED, blocked });
