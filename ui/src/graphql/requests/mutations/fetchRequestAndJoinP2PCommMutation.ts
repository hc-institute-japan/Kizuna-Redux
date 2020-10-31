import gql from "graphql-tag";

export default gql`
  mutation FetchRequestAndJoinP2PComm {
    fetchRequestAndJoinP2PComm {
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
