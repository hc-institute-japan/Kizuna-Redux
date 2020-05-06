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
        username: agent.username
      }))
    },
    me: async () => {
      const agent_id = await createZomeCall('/test-instance/profiles/get_my_address')();
      const my_profile = await createZomeCall('/test-instance/profiles/get_profile')({
        agent_address: agent_id
      });
      // TODO: handle when result is null
      return {
        id: my_profile.agent_id,
        username: my_profile.username
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
        const profile = await createZomeCall("/test-instance/profiles/create_profile")(username);
        return {
          id: profile.agent_id,
          username: profile.username,
        }
    }
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
