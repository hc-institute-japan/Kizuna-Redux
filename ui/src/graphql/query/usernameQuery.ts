import gql from "graphql-tag";

export default gql`
  query Username($address: String) {
    username(address: $address)
  }
`;
