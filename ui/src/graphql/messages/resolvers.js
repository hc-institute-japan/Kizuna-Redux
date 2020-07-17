import { getTimestamp } from "../../utils/helpers/";

let myAddress;

const getMyId = async (callZome) => {
  if (myAddress) return myAddress;
  myAddress = await callZome({
    id: "test-instance",
    zome: "profiles",
    func: "get_my_address",
  })();
  return myAddress;
};

const resolvers = {
  Query: {
    getP2PCommInstances: async (_, __, { callAdmin, callZome }) => {
      const allInstances = await callAdmin("admin/instance/running")();
      const p2pCommInstances = allInstances.filter(dna => 
        dna.id.includes("message-instance")
      );
      return p2pCommInstances.map(async p2pCommInstance => {
        const members = await callZome({
          id: p2pCommInstance.id,
          zome: "allowed-members",
          func: "get_members"
        })();

        const myAddress = await getMyId(callZome);
        const conversantAddress = members.members.find(member => member !== getMyId())

        const myUsername = await callZome({
          id: "test-instance",
          zome: "profiles",
          func: "get_username",
        })({
          agent_address: myAddress,
        });
  
        const conversantUsername = await callZome({
          id: "test-instance",
          zome: "profiles",
          func: "get_username",
        })({
          agent_address: conversantAddress,
        });

        return {
          id: p2pCommInstance.id,
          members: {
            me: {
              id: myAddress,
              username: myUsername,
            },
            conversant: {
              id: conversantAddress,
              username: conversantUsername,
            }
          },
        }
      });
    },
    getConversationFromId: async (_, input, { callZome }) => {
      const addresses = [input.author, input.recipient];
      const myAddress = await getMyId(callZome);
      const conversantId = addresses.every(address => address === myAddress) ? myAddress : addresses.find(address => address !== myAddress);
      const messages = await callZome({
        id: `message-instance-${myAddress}-${conversantId}`,
        zome: "messages",
        func: "get_messages_from_address",
      })({
        id: input.author,
      });
      const authorUsername = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: input.author,
      });
      const conversantUsername = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: conversantId,
      });
      const messagesRes = messages.map(message => {
        return {
          author: message.author,
          authorUsername,
          recipient: message.recipient,
          timestamp: message.timestamp,
          payload: message.message,
        }
      });
      return {
        name: conversantUsername,
        address: conversantId,
        messages: messagesRes,
      }
    },
    getConversationFromIds: async (_, { members }, { callZome }) => {
      const messages = await callZome({
        id: `message-instance-${members.myId}-${members.conversantId}`,
        zome: "messages",
        func: "get_messages_from_addresses",
      })({
        ids: [members.myId, members.conversantId],
      });
      
      const myUsername = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: members.myId,
      });

      const conversantUsername = await callZome({
        id: "test-instance",
        zome: "profiles",
        func: "get_username",
      })({
        agent_address: members.conversantId,
      });

      const usernames = [{
        id: members.myId,
        username: myUsername,
      }, {
        id: members.conversantId,
        username: conversantUsername,
      }];

      const getUsernameFromAddr = (address) => {
        const res = usernames.find(username => username.id === address);
        return res.username;
      };

      const messagesRes = messages.map(message => {
        return {
          author: message.author,
          authorUsername: getUsernameFromAddr(message.author),
          recipient: message.recipient,
          timestamp: message.timestamp,
          payload: message.message,
        }
      });

      return {
        name: conversantUsername,
        address: members.conversantId,
        messages: messagesRes,
      }

    }
  },
  Mutation: {
    sendMessage: async (_, input, { callZome }) => {
      const response = await callZome({
        id: `message-instance-${input.author}-${input.recipient}`,
        zome: "messages",
        func: "send",
      })({
        recipient: input.recipient,
        message: input.message,
        timestamp: getTimestamp(),
      });
      return {
        author: response.author,
        recipient: response.recipient,
        timestamp: response.timestamp,
        payload: response.message,
      };
    },
    initializeP2PDNA: async (_obj, { members }, { callZome, callAdmin, hcUprtcl }) => {
      const connection = await hcUprtcl();
      const myAddress = await getMyId(callZome);
      const agentConfig = await connection.getAgentConfig(myAddress);

      // initialize properties
      const membersProperties = {
        members: [members.myId, members.conversantId],
      };

      // clone DNA from template and initialize using properties
      try {
        await connection.cloneDna(
          agentConfig.id, // agent to 'host' the DNA
          `message-dna-${members.myId}-${members.conversantId}`, // DNA id
          `message-instance-${members.myId}-${members.conversantId}`, // instance id
          "QmRwzSjnJNBh7BHFbKTAKNsedtfZWqomxs8tDtSrUSwnfy", // DNA address
          membersProperties, // properties
          (interfaces) =>
            interfaces.find((iface) => iface.id === "websocket-interface") // interface
        );
        return true;
      } catch (error) {
          // check if the message instance is already configured
          const running_instances = await callAdmin("admin/instance/running")();
          const message_instances = running_instances.filter(instance => 
            instance.id.includes(`message-instance-${members.myId}-${members.conversantId}`)
          );

          if (message_instances.length !== 0) {
            return true;  
          } else {
            console.log(error);
            // revert changes to conductor config
            await callAdmin("admin/instance/remove")({id: `message-instance-${members.myId}-${members.conversantId}`});
            await callAdmin("admin/dna/uninstall")({id: `message-dna-${members.myId}-${members.conversantId}`});
            
            // return error here instead of false
            return false;
          }
      }
    },
  },
};

export default resolvers;
