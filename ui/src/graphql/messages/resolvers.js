import { createZomeCall, initAndGetHolochainClient, hcUprtcl } from "../connection/holochainClient";

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
    initializeP2PDNA: async (_, recipient) => {
      await initAndGetHolochainClient();
      const connection = await hcUprtcl();
      
      // get member agents' addresses
      const my_agent_id = await get_my_agent_id();
      const agentConfig = await connection.getAgentConfig(my_agent_id);

      // initialize properties
      const members = {
        sender: 'HcScjN8wBwrn3tuyg89aab3a69xsIgdzmX5P9537BqQZ5A7TEZu7qCY4Xzzjhma',
        recipient: 'HcScjwO9ji9633ZYxa6IYubHJHW6ctfoufv5eq4F7ZOxay8wR76FP4xeG9pY3ui'
      }

      // clone DNA from template and initialize using properties
      await connection.cloneDna(
        agentConfig.id,                                                                   // agent to 'host' the DNA
        "message-dna",                                                                    // DNA id
        "message-instance-nicko",                                                         // instance id
        "QmYXpZkdxajEhkprv1CSnaQYcZ6CGHqm7waGWs9prqweeE",                                 // DNA address
        members,                                                                          // properties
        (interfaces) => interfaces.find((iface) => iface.id === "websocket-interface")    // interface
      )
    },

    sendMessage: async (_, input) => {
      const response = await createZomeCall(
        "/message-instance-nicko/messages/send"
      )({
        author: input.author,
        recipient: input.recipient,
        message: input.message
      });
      return response
    },

    getMessages: async (_, input) => {
      const messages = await createZomeCall(
        "/message-instance-nicko/messages/get_messages_from_contact"
      )({
        id: input.id
      });
      return messages
    },

  },

};

export default resolvers;
