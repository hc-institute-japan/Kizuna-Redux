import { callZome } from "../../connection/holochainClient";

const resolvers = {
  Query: {
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
  Mutation: {
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

      return {
        anchor: "xd",
        payload: response,
      };
    },
    initializeP2PDNA: async (_obj, { requirements }, { hcUprtcl }) => {
      const connection = await hcUprtcl();

      // get member agents' addresses
      // const my_agent_id = await callZome({id: 'test-instance', zome: 'profiles', func: 'get_my_address'})();
      const agent_id = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_my_address",
      })();

      console.log(agent_id, requirements.id, connection.getAgentConfig);
      const agentConfig = await connection.getAgentConfig(agent_id);
      console.log(agent_id, requirements.id);

      // initialize properties

      const members = {
        sender: requirements.id,
        recipient: requirements.recipient,
      };
      console.log("lmao");

      // clone DNA from template and initialize using properties
      await connection.cloneDna(
        agentConfig.id, // agent to 'host' the DNA
        "messages", // DNA id
        "hc-run-agent", // instance id
        "Qmd7rDCxyVFN5U5eUMXHjdtgMz3sewdGV2fAPsLuDqCuss", // DNA address
        members, // properties
        (interfaces) =>
          interfaces.find((iface) => iface.id === "websocket-interface") // interface
      );
    },
  },
};

export default resolvers;
