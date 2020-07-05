import gql from "graphql-tag";

const schema = gql`
    type Profile {
        id: ID!
        username: String
    }
    input ProfileInput {
        username: String!
    }

    extend type Query {
        allAgents: [Profile!]!
        me: Profile
        username(address: String): String!
    }

    extend type Mutation {
        createProfile(username: String): Profile!
        deleteProfile(username: String): Boolean
    }
`;

export default schema;
