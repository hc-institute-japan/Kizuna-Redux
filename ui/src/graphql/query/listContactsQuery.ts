import gql from "graphql-tag";

export default gql`
  query ListContacts {
    contacts {
      id
      username
    }
  }
`;
