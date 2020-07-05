import gql from "graphql-tag";

const schema = gql`
    type Contacts {
        agent_id: ID!
        timestamp: Float
        contacts: [ID]
        blocked: [ID]
    }
    
    extend type Query {
        contacts: [Profile!]
        listBlocked: [ID]
    }

    extend type Mutation {
        addContact(username: String, timestamp: Float): Profile
        removeContact(username: String, timestamp: Float): Profile
        blockContact(username: String, timestamp: Float): Contacts
        unblockContact(username: String, timestamp: Float): Contacts
    }
`;

export default schema;
