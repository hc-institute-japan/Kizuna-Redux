import gql from "graphql-tag";

// query name: ListProfiles
// argument(s): None
// return data: listProfiles: {username}

export default gql`
    query GetHashedEmails ($email: String) {
        getHashedEmails (email: $email) {
            email_hash
        }
    }
`