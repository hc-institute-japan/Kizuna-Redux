import gql from "graphql-tag";

export default gql`
  mutation DeleteProfile($username: String) {
    createPublicProfile(username: $username)
  }
`;
