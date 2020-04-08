import gql from "graphql-tag";

export default gql`
    mutation CreateProfile($profileInput: ProfileInput) {
        createProfile (profileInput: $profileInput) {
            first_name
            last_name
            email
        }
    }
`