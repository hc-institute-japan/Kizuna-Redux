import { callZome } from "../../connection/holochainClient";

const resolvers = {
  Query: {
    contacts: async () => {
      const address = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "list_contacts",
      })();

      const contacts = address
        ? await address.map(async (a) => ({
            id: a,
            username: await callZome({
              id: "test-instance",
              zome: "profiles",
              func: "get_username",
            })({
              agent_address: a,
            }),
          }))
        : [];

      return contacts;
    },
  },
  Mutation: {
    addContact: async (_, input) => {
      const contact = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "add_contact",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });

      return {
        id: contact.agent_id,
        username: contact.username,
      };
    },
    //complete
    removeContact: async (_, input) => {
      const contact = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "remove_contact",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });

      return {
        id: contact.agent_id,
        username: contact.username,
      };
    },
    //complete
    blockContact: async (_, input) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "block",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });
      return {
        agent_id: contacts.agent_id,
        timestamp: contacts.timestamp,
        contacts: contacts.contacts,
        blocked: contacts.blocked,
      };
    },

    unblockContact: async (_, input) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "unblock",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });
      return {
        agent_id: contacts.agent_id,
        timestamp: contacts.timestamp,
        contacts: contacts.contacts,
        blocked: contacts.blocked,
      };
    },
  },
};

export default resolvers;
