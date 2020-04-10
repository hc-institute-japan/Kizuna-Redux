import { createZomeCall } from "../connection/holochainClient";

const resolvers = {
  Query: {
    listProfiles: async () =>
      await createZomeCall("/test-instance/profile/list_profiles")(),
  },

  Mutation: {
    createProfile: async (_, { profileInput }) =>
      await createZomeCall("/test-instance/profile/create_profile")({
        profile_input: profileInput,
      }),
  },
};

export default resolvers;
