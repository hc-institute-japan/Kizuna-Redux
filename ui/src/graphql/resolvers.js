import { createZomeCall } from "../connection/holochainClient";

/*
Holochain structure:
- instance name: test-instance
- zome name: profile
- available zome functions:
-- list_public_profiles
-- search_username
-- create_public_profile
-- create_private_profile
ZomeCall Structure:
-- createZomeCall('<instance_name>/<zome_name>/<function_name>)(arguments)
* argument key should be the same as the declared input name in the holochain function declarations
*/

const resolvers = {
  Query: {
    listProfiles: async () =>
      await createZomeCall("/test-instance/profile/list_public_profiles")(),
    searchUsername: async (_, username) =>
      await createZomeCall("/test-instance/profile/search_username")({
        input: username.username,
      }),
  },

  Mutation: {
    registerUsername: async (_, username) =>
      await createZomeCall("/test-instance/profile/create_public_profile")({
        input: username.profile_input,
      }),
    createProfile: async (_, { profile_input }) => {
      console.log(profile_input);
      return await createZomeCall(
        "/test-instance/profile/create_private_profile"
      )({
        input: profile_input,
      });
    },
  },
};

export default resolvers;
