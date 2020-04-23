import gql from "graphql-tag";

// mutation name: RegisterUsername
// argument(s): PublicProfileEntry
// return data: registerUsername: {username}

export default gql`
    mutation RegisterUsername($profile_input: PublicProfileEntry) {
        registerUsername (profile_input: $profile_input) {
            username
        }
    }
`