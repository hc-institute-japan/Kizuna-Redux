import gql from "graphql-tag";

// query name: ListProfiles
// argument(s): None
// return data: listProfiles: {username}

export default gql`
    query GetLinkedProfile ($username: String) {
        getLinkedProfile (username: $username) {
            first_name,
            last_name,
            email
        }
    }
`