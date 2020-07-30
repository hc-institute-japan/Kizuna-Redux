import gql from "graphql-tag";

export default gql`
  query GetConversationFromIds($members: Requirements, $properties: Properties) {
    getConversationFromIds(members: $members, properties: $properties) {
      name
      address
      instanceId
      messages {
        author
        authorUsername
        recipient
        timestamp
        payload
      }
    }
  }
`;
