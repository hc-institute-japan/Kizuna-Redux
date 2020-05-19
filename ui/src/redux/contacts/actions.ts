import { SET_CONTACTS, SET_BLOCKED } from "./actionTypes";

import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Contacts, Blocked, Profile } from "../types";

export const setContacts = (contacts: any) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_CONTACTS, contacts });

export const setBlocked = (blocked: Blocked) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_BLOCKED, blocked });
