import gql from "graphql-tag";

export default gql`
  query GetPrivateProfile($id: String) {
    getPrivateProfile(id: $id)
  }
`;
