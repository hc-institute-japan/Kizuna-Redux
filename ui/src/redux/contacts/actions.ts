import { AnyAction } from "redux";
import { ThunkDispatch } from "redux-thunk";
import { Profile } from "../../utils/types";
import { RootState } from "../reducers";
import { SET_BLOCKED, SET_CONTACTS } from "./actionTypes";

export const setContacts = (contacts: Array<Profile>) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_CONTACTS, contacts });

export const setBlocked = (blocked: Array<Profile>) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>
) => dispatch({ type: SET_BLOCKED, blocked });

export const getUsername = (address: string) => (
  dispatch: ThunkDispatch<void, {}, AnyAction>,
  getState: () => RootState
) => {
  const {
    contacts: { contacts },
  } = getState();
  return contacts.find((contact: Profile) => contact.id === address)
};
