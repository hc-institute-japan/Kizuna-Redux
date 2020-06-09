/*
Holochain structure:
- instance name: test-instance
- zome name: profiles
- available zome functions:
-- create_profile
-- get_all_agents
-- get_my_address
-- get_profile
ZomeCall Structure:
-- callZome('<instance_name>/<zome_name>/<function_name>)(arguments)
* argument key should be the same as the declared input name in the holochain function declarations
*/

let agent_id;

const get_my_agent_id = async () => {
  if (agent_id) return agent_id;
  agent_id = await callZome("test-instance", "profiles", "get_my_address")();
  return agent_id;
};

const resolvers = {
  Query: {
    //complete
    allAgents: async (_, _, { callZome }) => {
      const all_agents = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_all_agents",
      })();

      return all_agents.map((agent) => ({
        id: agent.agent_id,
        username: agent.username,
      }));
    },

    contacts: async (_, _, { callZome }) => {
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
    //complete
    me: async (_, _, { callZome }) => {
      const my_agent_id = await get_my_agent_id();
      const username = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: my_agent_id,
      });
      if (username) {
        return {
          id: my_agent_id,
          username,
        };
      } else {
        return {
          id: my_agent_id,
          username: null,
        };
      }
    },
    username: async (_, input, { callZome }) =>
      await callZome({
        id: "test-instance",
        zome: "profile",
        func: "get_username",
      })({
        agent_address: input,
      }),
    listBlocked: async (_, _, { callZome }) => {
      const contacts = await callZome(
        "test-instance",
        "profiles",
        "list_blocked"
      )();
      return [...contacts];
    },
  },

  Mutation: {
    //complete
    createProfile: async (_, username, { callZome }) => {
      const username_entry = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "set_username",
      })(username);
      return {
        id: username_entry.agent_id,
        username: username_entry.username,
      };
    },
    //complete
    deleteProfile: async (_, username, { callZome }) =>
      await callZome({
        id: "profiles",
        zome: "profile",
        func: "delete_profile",
      })({
        input: username.username,
      }),
    //complete
    addContact: async (_, input, { callZome }) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "add_contact",
      })({ username: input.username, timestamp: input.timestamp });
      return {
        id: contacts.agent_id,
        username: contacts.username,
      };
    },
    removeContact: async (_, input, { callZome }) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "remove_contact",
      })({ username: input.username, timestamp: input.timestamp });
      return {
        id: contacts.agent_id,
        username: contacts.username,
      };
    },
    blockContact: async (_, input, { callZome }) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "block",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });
      return {
        id: contacts.agent_id,
        username: contacts.username,
      };
    },
    unblockContact: async (_, input, { callZome }) => {
      const contacts = await callZome({
        id: "test-instance",
        zome: "contacts",
        func: "unblock",
      })({
        username: input.username,
        timestamp: input.timestamp,
      });
      return {
        id: contacts.agent_id,
        username: contacts.username,
      };
    },
  },
};

export default resolvers;
