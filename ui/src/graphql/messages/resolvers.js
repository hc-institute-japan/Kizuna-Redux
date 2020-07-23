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
        const conversantAddress = members.members.find(member => member !== myAddress)

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
      console.log(input);
      // can we have the schema to not allow id to be null if creator/conversant is null and vice versa?
      const P2PInstanceId = input.properties.id ? input.properties.id : `message-instance-${input.properties.creator}-${input.properties.conversant}`;
      const addresses = [input.properties.creator, input.properties.conversant];
      const conversantId = addresses.every(address => address === myAddress) ? myAddress : addresses.find(address => address !== myAddress);
      const messages = await callZome({
        id: P2PInstanceId,
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
      }).sort((a, b) => {
        const messageA = a.timestamp;
        const messageB = b.timestamp;
        if (messageA < messageB) {
          return -1;
        } 
        if (messageA > messageB) {
          return 1;
        }
        return 0;
      });
      return {
        name: conversantUsername,
        address: conversantId,
        instanceId: P2PInstanceId,
        messages: messagesRes,
      }
    },
    getConversationFromIds: async (_, input, { callZome }) => {
      const members = input.members;
      const P2PInstanceId = input.properties.id ? input.properties.id : `message-instance-${input.properties.creator}-${input.properties.conversant}`;
      const messages = await callZome({
        id: P2PInstanceId,
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
      }).sort((a, b) => {
        const messageA = a.timestamp;
        const messageB = b.timestamp;
        if (messageA < messageB) {
          return -1;
        } 
        if (messageA > messageB) {
          return 1;
        }
        return 0;
      });

      return {
        name: conversantUsername,
        address: members.conversantId,
        instanceId: P2PInstanceId,
        messages: messagesRes,
      }

    }
  },
  Mutation: {
    sendMessage: async (_, input, { callZome }) => {
      const P2PInstanceId = input.properties.id ? input.properties.id : `message-instance-${input.properties.creator}-${input.properties.conversant}`;
      const response = await callZome({
        id: P2PInstanceId,
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
    initializeP2PDNA: async (_obj, { properties }, { callZome, callAdmin, hcUprtcl }) => {
      const connection = await hcUprtcl();
      const myAddress = await getMyId(callZome);
      const agentConfig = await connection.getAgentConfig(myAddress);

      // initialize properties
      const membersProperties = {
        members: [properties.creator, properties.conversant],
      };

      const instanceId = `message-instance-${properties.creator}-${properties.conversant}`;
      

      // clone DNA from template and initialize using properties
      try {
        await connection.cloneDna(
          agentConfig.id, // agent to 'host' the DNA
          `message-dna-${properties.creator}-${properties.conversant}`, // DNA id
          instanceId, // instance id
          "QmW1SJB7imT5PApeCCTweYAcCcGn33kQW5MgFc7pXxCg3c", // DNA address
          membersProperties, // properties
          (interfaces) =>
            interfaces.find((iface) => iface.id === "websocket-interface") // interface
        );
        return {
          id: instanceId,
          creator: properties.creator,
          conversant: properties.conversant,
        };
      } catch (error) {
          // check if the message instance is already configured
          const running_instances = await callAdmin("admin/instance/running")();
          const message_instances = running_instances.filter(instance => 
            instance.id.includes(instanceId)
          );

          if (message_instances.length !== 0) {
            return {
              id: instanceId,
              creator: properties.creator,
              conversant: properties.conversant,
            };  
          } else {
            console.log(error);
            // revert changes to conductor config
            await callAdmin("admin/instance/remove")({id: `message-instance-${properties.creator}-${properties.conversant}`});
            await callAdmin("admin/dna/uninstall")({id: `message-dna-${properties.creator}-${properties.conversant}`});
            
            // return error here instead of false
            return {
              id: null,
              creator: null,
              conversant: null,
            };
          }
      }
    },
  },
};

export default resolvers;
