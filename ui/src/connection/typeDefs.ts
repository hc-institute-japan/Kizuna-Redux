import contactsSchema from "../graphql/contacts/schema";
import profileSchema from "../graphql/profile/schema";
import messagesSchema from "../graphql/messages/schema";
import requestSchema from "../graphql/requests/schema";
import gql from "graphql-tag";

const init = gql`
  type Query {
    filler: Boolean
  }

  type Mutation {
    filler2: Boolean
  }
`;

export default [
  init,
  profileSchema,
  contactsSchema,
  messagesSchema,
  requestSchema,
];
