import gql from "graphql-tag";

export default gql`
  mutation CreatePublicProfile($profile_input: PublicProfileEntry) {
    createPublicProfile(profile_input: $profile_input) {
      username
    }
  }
`;
