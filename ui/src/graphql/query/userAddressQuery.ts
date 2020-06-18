import gql from "graphql-tag";

export default gql`
  query UserAddress ($username: String) {
    userAddress(username: $username) {
        username
    }
  }
`;
