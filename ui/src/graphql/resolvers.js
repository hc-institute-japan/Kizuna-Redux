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

const resolvers = {
  Query: {
    allAgents: async () => {
      const all_agents = await createZomeCall('/test-instance/profiles/get_all_agents')();
      return all_agents.map(agent => ({
        id: agent.agent_id,
        username: agent.username
      }))
    },
    me: async () => {
      const agent_id = await createZomeCall('/test-instance/profiles/get_my_address')();
      const username = await createZomeCall('/test-instance/profiles/get_username')({
        agent_address: agent_id
      });
      if (username) {
        return {
          id: agent_id,
          username,
        }
      } else {
        return {
          id: agent_id,
          username: null,
        }
      }
    },
    // address: async () =>
    //   await createZomeCall("/test-instance/profile/get_agent_id")(),
    // isEmailRegistered: async (_, email) =>
    //   await createZomeCall('/test-instance/profile/is_email_registered')({ 
    //     email: email.email 
    //   }),
    // isUsernameRegistered: async (_, username) =>
    //   await createZomeCall('/test-instance/profile/is_username_registered')({ 
    //     username: username.username 
    // }),
  },

  Mutation: {
    createProfile: async (_, username ) => {
        const username_entry = await createZomeCall("/test-instance/profiles/set_username")(username);
        return {
          id: username_entry.agent_id,
          username: username_entry.username,
        }
    },
    deleteProfile: async (_, username) =>
      await createZomeCall("/profiles/profile/delete_profile")({
        input: username.username
      })
    // createPrivateProfile: async (_, profileInput ) =>
    //   await createZomeCall("/test-instance/profile/create_private_profile")({
    //     input: profileInput.profile_input
    //   }),
    // createPublicProfile: async (_, username ) =>
    //   await createZomeCall("/test-instance/profile/create_public_profile")({
    //     input: username.profile_input,
    //   }),
  },
};

export default resolvers;
