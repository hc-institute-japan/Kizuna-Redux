import { createZomeCall } from "../connection/holochainClient";

const resolvers = {
  Query: {
    getProfile: async (_, { address }) =>
      await createZomeCall("/test-instance/profile/get_profile")({ address }),
  },

  Mutation: {
    createProfile: async (_, { profileInput }) =>
      await createZomeCall("/test-instance/profile/create_private_profile")({
        ...profileInput,
      }),
  },
};

export default resolvers;
