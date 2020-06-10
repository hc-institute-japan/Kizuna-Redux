import { createZomeCall, initAndGetHolochainClient, hcUprtcl } from "../connection/holochainClient";

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
-- createZomeCall('<instance_name>/<zome_name>/<function_name>)(arguments)
* argument key should be the same as the declared input name in the holochain function declarations
*/

let agent_id;

const get_my_agent_id = async () => {
  if (agent_id) return agent_id;
  agent_id = await createZomeCall(
    "/test-instance/profiles/get_my_address"
  )();
  return agent_id;
}

const resolvers = {
  Query: {
    cloneDnaExample: async () => {
      await initAndGetHolochainClient();
      // instantiate holochainConnection
      // see https://uprtcl.github.io/js-uprtcl/modules/providers/uprtcl-holochain-provider.html#usage
      const hc_uprtcl = await hcUprtcl();

      const my_agent_id = await get_my_agent_id();
      const agentConfig = await hc_uprtcl.getAgentConfig(my_agent_id);

      // parameters here other than agentId should be taken from the arguments
      await hc_uprtcl.cloneDna(
        agentConfig.id,
        "dna-dos",
        "test-instance-dos",
        "QmR3sFbMo771b6zA9yhDRQx8aGV87yhzetm7Dnptj52WL4",
        {},
        (interfaces) => interfaces.find((iface) => iface.id === "websocket-interface")
      );

      const hello = await createZomeCall(
        "/test-instance-dos/messages/hello"
      )();
      return hello
    },
    //complete
    allAgents: async () => {
      const all_agents = await createZomeCall(
        "/test-instance/profiles/get_all_agents"
      )();

      return all_agents.map((agent) => ({
        id: agent.agent_id,
        username: agent.username,
      }));
    },

    contacts: async () => {
      const address = await createZomeCall(
        "/test-instance/contacts/list_contacts"
      )();

      const contacts = address
        ? await address.map(async (a) => ({
            id: a,
            username: await createZomeCall(
              "/test-instance/profiles/get_username"
            )({
              agent_address: a,
            }),
          }))
        : [];
      console.log(contacts);

      return contacts;
    },
    //complete
    me: async () => {
        const my_agent_id = await get_my_agent_id();
        const username = await createZomeCall(
          "/test-instance/profiles/get_username"
        )({
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
    username: async (_, input) =>
      await createZomeCall("/test-instance/profile/get_username")({
        agent_address: input,
      }),
    listBlocked: async () => {
      const contacts = await createZomeCall(
        "/test-instance/profiles/list_blocked"
      )();
      return [...contacts];
    },
  },

  Mutation: {
    //complete
    createProfile: async (_, username) => {
        const username_entry = await createZomeCall(
          "/test-instance/profiles/set_username"
        )(username);
        return {
          id: username_entry.agent_id,
          username: username_entry.username,
        };
    },
    //complete
    deleteProfile: async (_, username) =>
      await createZomeCall("/profiles/profile/delete_profile")({
        input: username.username,
      }),
    //complete
    addContact: async (_, input) => {
      const contacts = await createZomeCall(
        "/test-instance/contacts/add_contact"
      )({username: input.username, timestamp: input.timestamp});
      return {
        id: contacts.agent_id,
        username: contacts.username
      };
    },
    removeContact: async (_, input) => {
      const contacts = await createZomeCall(
        "/test-instance/contacts/remove_contact"
      )({username: input.username, timestamp: input.timestamp});
      return {
        id: contacts.agent_id,
        username: contacts.username
      };
    },
    blockContact: async (_, input) => {
      const contacts = await createZomeCall(
        "/test-instance/contacts/block"
      )({username: input.username, timestamp: input.timestamp});
      return {
        id: contacts.agent_id,
        username: contacts.username
      };
    },
    unblockContact: async (_, input) => {
      const contacts = await createZomeCall(
        "/test-instance/contacts/unblock"
      )({username: input.username, timestamp: input.timestamp});
      return {
        id: contacts.agent_id,
        username: contacts.username
      };
    }
  },
};

export default resolvers;
