import gql from "graphql-tag";

export default gql`
  mutation CreatePrivateProfile($profile_input: PrivateProfileEntry) {
    createPrivateProfile(profile_input: $profile_input) {
      first_name
      last_name
      email
    }
  }
`;