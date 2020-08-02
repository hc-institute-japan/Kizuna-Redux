import gql from "graphql-tag";

export default gql`
  query GetP2PCommInstances {
    getP2PCommInstances {
      id
      members {
        me {
          id
          username
        }
        conversant {
          id
          username
        }
      }
    }
  }
`;
