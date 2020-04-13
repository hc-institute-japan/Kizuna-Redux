import gql from "graphql-tag";

// query name: ListProfiles
// argument(s): None
// return data: listProfiles: {username}

export default gql`
    query ListProfiles {
        listProfiles {
            username
        }
    }
`