import contactResolvers from "../graphql/contacts/resolvers";
import profileResolvers from "../graphql/profile/resolvers";
import messagesResolvers from "../graphql/messages/resolvers";
import requestResolvers from "../graphql/requests/resolvers";
import p2pcommResolvers from "../graphql/p2pcomm/resolvers";

export default [
  profileResolvers,
  contactResolvers,
  p2pcommResolvers,
  messagesResolvers,
  requestResolvers,
];
