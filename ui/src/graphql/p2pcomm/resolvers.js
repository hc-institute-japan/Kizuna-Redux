import { getMyId, initializeOrJoinP2PDNA } from "../utils/";

const resolvers = {
  Query: {
    getP2PCommInstances: async (_, __, { callAdmin, callZome }) => {
      const allInstances = await callAdmin("admin/instance/running")();
      const p2pCommInstances = allInstances.filter(instance => 
        instance.id.includes("p2p-instance")
      );
      return p2pCommInstances.map(async p2pCommInstance => {
        const members = await callZome({
          id: p2pCommInstance.id,
          zome: "allowed-members",
          func: "get_members"
        })();

        const me = await getMyId(callZome);
        console.log(me);
        const conversantAddress = members.members.every(address => address === me) ? me : members.members.find(address => address !== me);
        console.log(conversantAddress);

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
          agent_address: conversantAddress,
        });

        return {
          id: p2pCommInstance.id,
          members: {
            me: {
              id: me,
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
  },
  Mutation: {
    initializeP2PDNA: async (_obj, { properties }, { callZome, callAdmin, hcUprtcl }) => await initializeOrJoinP2PDNA(properties, callZome, callAdmin, hcUprtcl),
  },
};

export default resolvers;