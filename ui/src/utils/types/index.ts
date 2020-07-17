export interface ActionType {
  type: string;
  [key: string]: any;
}

// probably needes to be defined strictly
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

export interface Message {
  sender: string,
  payload: string,
  createdAt: number,
}

export interface Conversation {
  name: string,
  address: string,
  messages: Array<Message>,
}

export interface namedAddresses {
  myId: string,
  conversantId: string
}

export interface Members {
  me: Profile,
  conversant: Profile,
}
export interface P2PInstance {
  id: string,
  members: Members
}