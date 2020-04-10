import gql from "graphql-tag";

export default gql`
  query GetFirstName {
    getFirstName {
      id
      createdAt
      name
    }
  }
`;
