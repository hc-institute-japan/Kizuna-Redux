import gql from "graphql-tag";

// query name: SearchUsername
// argument(s): String
// return data: searchUsername: {username}

export default gql`
    query SearchUsername($username: String) {
        searchUsername(username: $username) {
            username
        }
    }
`