import { createZomeCall, initAndGetHolochainClient } from "../connection/holochainClient";

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
    hello: async () => {
      const client = await initAndGetHolochainClient();
      console.log(client);
      const dnaResult = await client.call('admin/dna/install_from_file')({
        id: "dna-dos",
        path: "/Users/tats/projects/Kizuna/dnados/dist/dnados.dna.json",
        copy: true,
      });
      console.log("OKAY");
      console.log(dnaResult);


      const my_agent_id = await get_my_agent_id();
      const agentList = await client.call('admin/agent/list')({});
      const agentName = agentList.find((a) => a.public_address === my_agent_id);

      const instanceResult = await client.call('admin/instance/add')({
        id: "test-instance-dos",
        agent_id: agentName.id,
        dna_id: "dna-dos",
      });
      console.log("OKAY");
      console.log(instanceResult);
  
      // const interfaceList = await client.call('admin/interface/list', {});
      // // TODO: review this: what interface to pick?
      // console.log(interfaceList);
      // const iface = interfaceList[0];
  
      const ifaceResult = client.call('admin/interface/add_instance')({
        instance_id: "test-instance-dos",
        interface_id: "websocket-interface",
      });
      console.log(ifaceResult);
  
      await new Promise((resolve) => setTimeout(() => resolve(), 300));
      const startResult = await client.call('admin/instance/start')({ id: "test-instance-dos" });

      console.log("OKAY");
      console.log(startResult);

      const say_hello = await createZomeCall(
        "/test-instance-dos/messages/say_hello"
      )();
      console.log(say_hello)
      return say_hello
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
