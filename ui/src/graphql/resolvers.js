import { createZomeCall } from "../connection/holochainClient";

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
      try {
        const contacts = await createZomeCall(
          "/test-instance/contacts/add_contact"
        )({username: input.username, timestamp: input.timestamp});
        return {
          id: contacts.agent_id,
          username: contacts.username,
          //profiles zome error fields
          existing: false,
          registered: false,
          multiple: false,
          //contacts zome error fields
          duplicate: false,
          outoforder: false,
          uninitialized: false,
          notfound: false ,
          invalidop: false
        };
      } catch (error) {
        if (error.message.includes("This address is already added in contacts")) {
          return {
            id: null,
            username: input.username,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: true,
            outoforder: false,
            uninitialized: false,
            notfound: false,
            invalidop: false
          }
        } else if (error.message.includes("The timestamp is the same with or less than the previous timestamp")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: true,
            uninitialized: false,
            notfound: false,
            invalidop: false
          }
        }
      }
    },
    removeContact: async (_, input) => {
      try {
        const contacts = await createZomeCall(
          "/test-instance/contacts/remove_contact"
        )({username: input.username, timestamp: input.timestamp});
        return {
          id: contacts.agent_id,
          username: contacts.username,
          //profiles zome error fields
          existing: false,
          registered: false,
          multiple: false,
          //contacts zome error fields
          duplicate: false,
          outoforder: false,
          uninitialized: false,
          notfound: false,
          invalidop: false
        };
      } catch (error) {
        if (error.message.includes("This address wasn't found in the contract")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: false,
            uninitialized: false,
            notfound: true,
            invalidop: false
          }
        } else if (error.message.includes("The timestamp is the same with or less than the previous timestamp")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: true,
            uninitialized: false,
            notfound: false,
            invalidop: false
          } 
        } else if (error.message.includes("This agent has no contacts yet")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: false,
            uninitialized: true,
            notfound: false,
            invalidop: false
          }
        }
      }
    },
    blockContact: async (_, input) => {
      try {
        const contacts = await createZomeCall(
          "/test-instance/contacts/block"
        )({username: input.username, timestamp: input.timestamp});
        return {
          id: contacts.agent_id,
          username: contacts.username,
          //profiles zome error fields
          existing: false,
          registered: false,
          multiple: false,
          //contacts zome error fields
          duplicate: false,
          outoforder: false,
          uninitialized: false,
          notfound: false,
          invalidop: false
        };
      } catch (error) {
        if (error.message.includes("The contact is already in the list of blocked contacts")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: true,
            outoforder: false,
            uninitialized: false,
            notfound: false,
            invalidop: false
          }
        } else if (error.message.includes("The timestamp is the same with or less than the previous timestamp")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            // error fields
            duplicate: false,
            outoforder: true,
            uninitialized: false,
            notfound: false,
            invalidop: false
          } 
        } else if (error.message.includes("Cannot block yourself")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: false,
            uninitialized: false,
            notfound: false,
            invalidop: true
          }
        }
      }
    },
    unblockContact: async (_, input) => {
      try {
        const contacts = await createZomeCall(
          "/test-instance/contacts/unblock"
        )({username: input.username, timestamp: input.timestamp});
        return {
          id: contacts.agent_id,
          username: contacts.username,
          //profiles zome error fields
          existing: false,
          registered: false,
          multiple: false,
          //contacts zome error fields
          duplicate: true,
          outoforder: false,
          uninitialized: false,
          notfound: false,
          invalidop: false
        };
      } catch (error) {
        if (error.message.includes("The contact is already in the list of blocked contacts")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: true,
            outoforder: false,
            uninitialized: false,
            notfound: false,
            invalidop: false
          }
        } else if (error.message.includes("The timestamp is the same with or less than the previous timestamp")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: true,
            uninitialized: false,
            notfound: false,
            invalidop: false
          } 
        } else if (error.message.includes("Unblocking own agent id")) {
          return {
            id: null,
            username: null,
            //profiles zome error fields
            existing: false,
            registered: false,
            multiple: false,
            //contacts zome error fields
            duplicate: false,
            outoforder: false,
            uninitialized: false,
            notfound: false,
            invalidop: true
          }
        }
      }
    },
  },
};

export default resolvers;
