import gql from "graphql-tag";

export default gql`
  query ListBlocked {
    listBlocked {
        agent_id
    }
  }
`;
