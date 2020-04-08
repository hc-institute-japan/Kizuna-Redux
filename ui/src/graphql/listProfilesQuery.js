import gql from "graphql-tag";

export default gql`
    query ListProfiles {
        listProfiles {
            first_name
        }
    }
`