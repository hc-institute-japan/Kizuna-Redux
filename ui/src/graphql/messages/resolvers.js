import { getP2PInstanceId, getTimestamp } from "../../utils/helpers/";
import { getMyId } from "../utils/";

const resolvers = {
  Query: {
    getConversationFromId: async (_, input, { callZome }) => {
      // can we have the schema to not allow id to be null if creator/conversant is null and vice versa?
      const P2PInstanceId = input.properties.id
        ? input.properties.id
        : getP2PInstanceId(
            input.properties.creator,
            input.properties.conversant
          );
      const addresses = [input.properties.creator, input.properties.conversant];
      const me = await getMyId(callZome);
      const conversantId = addresses.every((address) => address === me)
        ? me
        : addresses.find((address) => address !== me);
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
      // console.log(conversantUsername);
      const messagesRes = messages
        .map((message) => ({
          author: message.author,
          authorUsername,
          recipient: message.recipient,
          timestamp: message.timestamp,
          payload: message.message,
        }))
        .sort((a, b) => a.timestamp - b.timestamp);
      return {
        name: conversantUsername,
        address: conversantId,
        instanceId: P2PInstanceId,
        messages: messagesRes,
      };
    },
    getConversationFromIds: async (_, input, { callZome }) => {
      const members = input.members;
      const P2PInstanceId = input.properties.id
        ? input.properties.id
        : getP2PInstanceId(
            input.properties.creator,
            input.properties.conversant
          );
      const messages = await callZome({
        id: P2PInstanceId,
        zome: "messages",
        func: "get_all_messages_from_addresses",
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

      const usernames = [
        {
          id: members.myId,
          username: myUsername,
        },
        {
          id: members.conversantId,
          username: conversantUsername,
        },
      ];

      const getUsernameFromAddr = (address) => {
        const res = usernames.find((username) => username.id === address);
        return res.username;
      };

      const messagesRes = messages
        .map((message) => {
          return {
            author: message.author,
            authorUsername: getUsernameFromAddr(message.author),
            recipient: message.recipient,
            timestamp: message.timestamp,
            payload: message.message,
          };
        })
        .sort((a, b) => a.timestamp - b.timestamp);

      return {
        name: conversantUsername,
        address: members.conversantId,
        instanceId: P2PInstanceId,
        messages: messagesRes,
      };
    },
  },
  Mutation: {
    sendMessage: async (_, input, { callZome }) => {
      const P2PInstanceId = input.properties.id
        ? input.properties.id
        : getP2PInstanceId(
            input.properties.creator,
            input.properties.conversant
          );
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
  },
};

export default resolvers;
