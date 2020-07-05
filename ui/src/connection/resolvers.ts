import contactResolvers from "../graphql/contacts/resolvers";
import profileResolvers from "../graphql/profile/resolvers";
import messagesResolvers from "../graphql/messages/resolvers";
import requestResolvers from "../graphql/requests/resolvers";

export default [
  profileResolvers,
  contactResolvers,
  messagesResolvers,
  requestResolvers,
];
