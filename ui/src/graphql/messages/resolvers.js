import { callZome } from "../../connection/holochainClient";

const resolvers = {
  Query: {
    initializeP2PDNA: async (_obj, { requirements }, context) => {
      const { cloneDna, getAgentConfig } = await context.hcUprtcl();
      // get member agents' addresses
      // const my_agent_id = await callZome({id: 'test-instance', zome: 'profiles', func: 'get_my_address'})();
      const agentConfig = await getAgentConfig(requirements.id);
      // initialize properties
      console.log(agentConfig);
      const members = {
        sender: requirements.id,
        recipient: requirements.recipient,
      };

      // clone DNA from template and initialize using properties
      await cloneDna(
        agentConfig.id, // agent to 'host' the DNA
        "message-dna", // DNA id
        "test-instance", // instance id
        "QmYXpZkdxajEhkprv1CSnaQYcZ6CGHqm7waGWs9prqweeE", // DNA address
        members, // properties
        (interfaces) =>
          interfaces.find((iface) => iface.id === "websocket-interface") // interface
      );
    },

    sendMessage: async (_, input, { callZome }) => {
      const response = await callZome({
        id: "hc-run-agent",
        zome: "messages",
        func: "send",
      })({
        author: input.author,
        recipient: input.recipient,
        message: input.message,
      });
      return response;
    },

    getMessages: async (_, input) => {
      const messages = await callZome({
        id: "hc-run-agent",
        zome: "messages",
        func: "get_messages_from_contact",
      })({
        id: input.id,
      });
      return messages;
    },
  },
};

export default resolvers;
