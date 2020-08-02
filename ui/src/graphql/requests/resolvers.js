import { initializeOrJoinP2PDNA, getMyId } from "../utils/";

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
    // currently not used but can be used to let the creator of p2pcomm
    // know that this agent succesfully joined  the dna.
    acceptRequest: async (_, input, { callZome }) => {
      await callZome({
        id: "test-instance",
        zome: "requests",
        func: "accept_request",
      })({
        sender: input.sender,
      });
    },
    fetchRequestAndJoinP2PComm: async (_, __, { callZome, callAdmin, hcUprtcl }) => {
      const fetchRequestsResult = await callZome({
        id: "test-instance",
        zome: "requests",
        func: "fetch_requests"
      })();
      console.log(fetchRequestsResult);

      const me = await getMyId(callZome);

      const joinResults = fetchRequestsResult.map(async request => {
        // this if from the perspective of the creator of the p2pchat
        const properties = {
          creator: request.from,
          conversant: me,
        };
        const initializeResult = await initializeOrJoinP2PDNA(properties, callZome, callAdmin, hcUprtcl);
        // TODO: handle error from initializeOrJoin here.
        // Probably better to let the user decide whether to retry joining.
        if (initializeResult.id !== null) {
          await callZome({
            id: "test-instance",
            zome: "requests",
            func: "delete_request"
          })({
            request_address: request.address,
          });
        };
        return initializeResult;
      });

      // TODO: need to handle possible errors for each process of request.
      // Right now, we are just filtering the ones that resulted in "error" from initializeP2P.
      return joinResults.filter(result => result.id !== null).map(async filteredResultPromise => {
        const filteredResult = await filteredResultPromise;
        // this is from the perspective of me
        const myUsername = await callZome({
          id: "test-instance",
          zome: "profiles",
          func: "get_username",
        })({
          agent_address: me,
        });
  
        const conversantUsername = await callZome({
          id: "test-instance",
          zome: "profiles",
          func: "get_username",
        })({
          agent_address: filteredResult.creator,
        });

        return {
          id: filteredResult.id,
          members: {
            me: {
              id: me,
              username: myUsername,
            },
            conversant: {
              id: filteredResult.creator,
              username: conversantUsername,
            }
          },
        }
      });
    },
  },
};

export default resolvers;
