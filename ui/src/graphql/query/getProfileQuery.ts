import gql from "graphql-tag";

export default gql`
  query GetProfile($address: String) {
    getProfile(address: $address)
  }
`;
