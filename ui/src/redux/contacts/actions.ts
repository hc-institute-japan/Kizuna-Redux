import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Blocked } from "../../utils/types";
import { SET_BLOCKED, SET_CONTACTS } from "./actionTypes";

export const setContacts = (contacts: any) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_CONTACTS, contacts });

export const setBlocked = (blocked: Blocked) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_BLOCKED, blocked });
