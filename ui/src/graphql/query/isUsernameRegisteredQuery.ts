import gql from "graphql-tag";

export default gql`
    query isUsernameRegistered ($username: String) {
        isUsernameRegistered (username: $username) {
            value
        }
    }
`