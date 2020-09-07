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

const getAgentConfig = async (agentAddress, callAdmin) => {
  const agentList = await callAdmin('admin/agent/list')({});
  const agentName = agentList.find((a) => a.public_address === agentAddress);
  return agentName;
};

export const initializeOrJoinP2PDNA = async (
  properties,
  callZome,
  callAdmin,
) => {
  console.log(properties);
  // const connection = await hcUprtcl();
  const me = await getMyId(callZome);
  console.log(me);
  const agentConfig = await getAgentConfig(me, callAdmin);
  console.log(agentConfig);
  const instanceId = getP2PInstanceId(
    properties.creator,
    properties.conversant
    );
    console.log(instanceId);
  // initialize properties
  const p2pProperties = {
    members: [properties.creator, properties.conversant],
    instance_id: instanceId,
  };


  // clone DNA from template and initialize using properties
  try {
    // await connection.cloneDna(
    //   agentConfig.id, // agent to 'host' the DNA
    //   getP2PDnaId(properties.creator, properties.conversant), // DNA id
    //   instanceId, // instance id
    //   process.env.REACT_APP_DNA_PATH, // DNA address
    //   p2pProperties, // properties
    //   (interfaces) =>
    //     interfaces.find((iface) => iface.id === "websocket-interface") // interface
    // );
    const newDnaId = getP2PDnaId(properties.creator, properties.conversant);
    console.log(newDnaId);
    const dnaPath = "/Users/tats/projects/Kizuna/dnas/p2pcomm/dist/p2pcomm.dna.json";
    console.log(dnaPath);
    const agentId = agentConfig.id;
    console.log(agentId);
    const dnaResult = await callAdmin('admin/dna/install_from_file')({
      id: newDnaId,
      path: dnaPath,
      properties: p2pProperties,
      copy: true,
    });
    console.log(dnaResult);
    
    const instanceResult = await callAdmin('admin/instance/add')({
      id: instanceId,
      agent_id: agentId,
      dna_id: newDnaId,
    });
    console.log(instanceResult);
    
    const interfaceList = await callAdmin('admin/interface/list')();
    // TODO: review this: what interface to pick?
    console.log(interfaceList);
    const iface = interfaceList.find((iface) => iface.id === "websocket-interface");
    console.log(iface);
    
    // TATS: The bug is happening here for onSignal
    const ifaceResult = callAdmin('admin/interface/add_instance')({
      instance_id: instanceId,
      interface_id: iface.id,
    });
    console.log(ifaceResult);
    
    await new Promise((resolve) => setTimeout(() => resolve(), 300));
    const startResult = await callAdmin('admin/instance/start')({ id: instanceId });
    console.log(startResult);
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
