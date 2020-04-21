import gql from "graphql-tag";

// query name: ListProfiles
// argument(s): None
// return data: listProfiles: {username}

export default gql`
    mutation Register ($public_input: PublicProfileEntry, $private_input: PrivateProfileEntry) {
        register (public_input: $public_input, private_input: $private_input) {
            username
        }
    }
`