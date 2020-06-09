const schema = `
    type Profile {
        id: ID!
        username: String
    }
    input ProfileInput {
        username: String!
    }

    type Query {
        allAgents: [Profile!]!
        me: Profile
        username(address: String): String!
    }

    type Mutation {
        createProfile(username: String): Profile!
        deleteProfile(username: String): Boolean
        updateProfile(profile: ProfileInput): Boolean
    }
`;

export default schema;
