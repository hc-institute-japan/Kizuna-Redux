export interface ActionType {
  type: string;
  [key: string]: any;
}

export interface Profile {
  [key: string]: any | null;
}

export interface IndexedContacts {
  indexedContacts: {
    [key: string]: [Profile];
  };
}

export interface Contacts {
  contacts: [Profile];
}

export interface Blocked {
  blocked: [Profile];
}
