import gql from "graphql-tag";

export default gql`
  mutation CreateProfile($profile_input: PrivateProfileEntry) {
    createProfile(profile_input: $profile_input) {
      first_name
      last_name
      email
    }
  }
`;
