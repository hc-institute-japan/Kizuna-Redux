const resolvers = {
  Mutation: {
    requestToChat: async (_, input, { callZome }) => {
      const requestResult = await callZome({
        id: "test-instance",
        zome: "requests",
        func: "request_to_chat",
      })({
        sender: input.sender,
        recipient: input.recipient,
      });
      return requestResult;
    },
    acceptRequest: async (_, input, { callZome }) => {
      await callZome({
        id: "test-instance",
        zome: "requests",
        func: "accept_request",
      })({
        sender: input.sender,
      });
    },
  },
};

export default resolvers;
