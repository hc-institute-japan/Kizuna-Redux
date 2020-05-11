import gql from "graphql-tag";

export default gql`
  query AllAgents {
    allAgents {
        username
    }
  }
`;
