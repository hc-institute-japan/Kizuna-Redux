import gql from "graphql-tag";

export default gql`
    query IsEmailRegistered ($email: String) {
        isEmailRegistered (email: $email) {
            value
        }
    }
`