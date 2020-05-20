import gql from "graphql-tag";

export default gql`
  mutation UpdateProfile($profile: ProfileInput) {
    updateProfile(profile: $profile)
  }
`;
