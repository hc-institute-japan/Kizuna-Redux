import gql from "graphql-tag";

export default gql`
  mutation CreateFirstName($firstNameInput: FirstNameInput) {
    createFirstName(firstNameInput: $firstNameInput) {
      id
      createdAt
      name
    }
  }
`;
