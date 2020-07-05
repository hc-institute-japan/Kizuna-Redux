const resolvers = {
  Query: {
    allAgents: async (_obj, _args, { callZome }) => {
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
    me: async (_obj, _args, { callZome, onSignal }) => {
      // onSignal("test", (signal) => console.log(signal));
      const agent_id = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_my_address",
      })();
      const username = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: agent_id,
      });
      if (username) {
        return {
          id: agent_id,
          username,
        };
      } else {
        return {
          id: agent_id,
          username: null,
        };
      }
    },
    username: async (_obj, input, { callZome }) =>
      await callZome({
        id: "test-instance",
        zome: "profile",
        func: "get_username",
      })({
        agent_address: input,
      }),
  },
  Mutation: {
    createProfile: async (_obj, username, { callZome }) => {
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
    deleteProfile: async (_obj, username, { callZome }) =>
      await callZome({
        id: "profiles",
        zome: "profile",
        func: "delete_profile",
      })({
        input: username.username,
      }),
  },
};

export default resolvers;
