import { SET_CONTACTS, SET_BLOCKED } from "./actionTypes";
import { ActionType, Profile } from "../types";

const initialState = {
  contacts: [],
  indexedContacts: {},
  blocked: [
    { username: "Neil1" },
    { username: "Dave1" },
    { username: "Tatsuya1" },
    { username: "Neil2" },
    { username: "Dave2" },
    { username: "Tatsuya2" },
  ],
};

export default (state = initialState, action: ActionType) => {
  switch (action.type) {
    case SET_CONTACTS:
      let indexedContacts: any = {};
      const contacts = action.contacts.sort((a: Profile, b: Profile) => {
        const usernameA = a.username.toLowerCase();
        const usernameB = b.username.toLowerCase();
        if (usernameA < usernameB) {
          return -1;
        }
        if (usernameA > usernameB) {
          return 1;
        }
        return 0;
      });

      if (contacts.length > 0) {
        let char = contacts[0].username.charAt(0).toUpperCase();
        indexedContacts[char] = [];
        contacts.forEach((contact: Profile) => {
          const currChar = contact.username.charAt(0).toUpperCase();
          if (currChar !== char) {
            char = currChar;
            indexedContacts[char] = [];
          }
          const currArr = indexedContacts[currChar];
          currArr.push(contact);
        });
      }
      return {
        ...state,
        contacts,
        indexedContacts,
      };
    case SET_BLOCKED:
      return {
        ...state,
        blocked: action.blocked,
      };
    default:
      return state;
  }
};
