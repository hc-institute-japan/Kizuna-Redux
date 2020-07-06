import { callZome, callAdmin } from "../../connection/holochainClient";

const resolvers = {
  Query: {
    getMessages: async (_, input ) => {
      const messages = await callZome({
        id: `message-instance-${input.author}-${input.recipient}`,
        zome: "messages",
        func: "get_messages_from_contact",
      })({
        id: input.author,
      });
      return messages;
    },
    getMessageDNAs: async () => {
      const allDNAs = await callAdmin("admin/dna/list")();
      const messageDNAs = allDNAs.filter(dna => 
        dna.id.includes("message-dna")
      );
      return messageDNAs;
    },
  },
  Mutation: {
    sendMessage: async (_, input, { callZome }) => {
      const response = await callZome({
        id: `message-instance-${input.author}-${input.recipient}`,
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
        members: [requirements.id, requirements.recipient],
      };

      // clone DNA from template and initialize using properties
      try {
        await connection.cloneDna(
          agentConfig.id, // agent to 'host' the DNA
          `message-dna-${requirements.id}-${requirements.recipient}`, // DNA id
          `message-instance-${requirements.id}-${requirements.recipient}`, // instance id
          "mWMcdbwrkFwMWsd836se32cwD2SRgHx8KY8qP4PoFpVwc", // DNA address
          members, // properties
          (interfaces) =>
            interfaces.find((iface) => iface.id === "websocket-interface") // interface
        );
        return true;
      } catch (error) {
          // check if the message instance is already configured
          const running_instances = await callAdmin("admin/instance/running")();
          const message_instances = running_instances.filter(instance => 
            instance.id.includes(`message-instance-${requirements.id}-${requirements.recipient}`)
          );

          if (message_instances.length != 0) {
            return true;  
          } else {
            console.log(error);
            // revert changes to conductor config
            await callAdmin("admin/instance/remove")({id: `message-instance-${requirements.id}-${requirements.recipient}`});
            await callAdmin("admin/dna/uninstall")({id: `message-dna-${requirements.id}-${requirements.recipient}`})
  
            return false;
          }
      }
    },
  },
};

export default resolvers;
