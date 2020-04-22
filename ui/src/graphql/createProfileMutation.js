import gql from "graphql-tag";

// mutation name: CreateProfile
// argument(s): PrivateProfileEntry
// return data: createProfile: {first_name, last_name, email}

export default gql`
  mutation CreatePrivateProfile($profile_input: PrivateProfileEntry) {
    createPrivateProfile(profile_input: $profile_input) {
      first_name
      last_name
      email
    }
  }
`;
