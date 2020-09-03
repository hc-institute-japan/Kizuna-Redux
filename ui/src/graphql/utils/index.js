import { getP2PDnaId, getP2PInstanceId } from "../../utils/helpers";

let myAddress;

export const getMyId = async (callZome) => {
  if (myAddress) return myAddress;
  myAddress = await callZome({
    id: "test-instance",
    zome: "profiles",
    func: "get_my_address",
  })();
  return myAddress;
};

export const initializeOrJoinP2PDNA = async (
  properties,
  callZome,
  callAdmin,
  hcUprtcl
) => {
  console.log(properties);
  const connection = await hcUprtcl();
  const me = await getMyId(callZome);
  const agentConfig = await connection.getAgentConfig(me);
  const instanceId = getP2PInstanceId(
    properties.creator,
    properties.conversant
  );
  // initialize properties
  const p2pProperties = {
    members: [properties.creator, properties.conversant],
    instance_id: instanceId,
  };


  // clone DNA from template and initialize using properties
  try {
    await connection.cloneDna(
      agentConfig.id, // agent to 'host' the DNA
      getP2PDnaId(properties.creator, properties.conversant), // DNA id
      instanceId, // instance id
      process.env.REACT_APP_DNA_PATH, // DNA address
      p2pProperties, // properties
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
    const message_instances = running_instances.filter((instance) =>
      instance.id.includes(instanceId)
    );

    if (message_instances.length !== 0) {
      return {
        id: instanceId,
        creator: properties.creator,
        conversant: properties.conversant,
      };
    } else {
      // console.log(error);
      // revert changes to conductor config
      await callAdmin("admin/instance/remove")({ id: instanceId });
      await callAdmin("admin/dna/uninstall")({ id: instanceId });

      // return error here instead of this
      return {
        id: null,
        creator: null,
        conversant: null,
      };
    }
  }
};
