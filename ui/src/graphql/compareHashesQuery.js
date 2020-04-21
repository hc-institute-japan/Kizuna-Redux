import gql from "graphql-tag";

// query name: ListProfiles
// argument(s): None
// return data: listProfiles: {username}

export default gql`
    query CompareHashes ($input: PrivateProfileEntry) {
        compareHashes (input: $input) {
            email_hash
        }
    }
`