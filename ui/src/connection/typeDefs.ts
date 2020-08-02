import contactsSchema from "../graphql/contacts/schema";
import profileSchema from "../graphql/profile/schema";
import messagesSchema from "../graphql/messages/schema";
import requestSchema from "../graphql/requests/schema";
import p2pcommSchema from "../graphql/p2pcomm/schema";
import gql from "graphql-tag";

const init = gql`
  type Query {
    filler: Boolean
  }

  type Mutation {
    filler2: Boolean
  }

  type Subscription {
    filler3: Boolean
  }
`;

export default [
  init,
  p2pcommSchema,
  profileSchema,
  contactsSchema,
  messagesSchema,
  requestSchema,
];
