import { connect as hcWebClientConnect } from "@holochain/hc-web-client";
import { get } from "lodash/fp";
// import mockCallZome from "../mock-dnas/mockCallZome";

let holochainClient;

// NB: This should be set to false when you want to run against a Holochain Conductor
// with a websocket interface running on REACT_APP_DNA_INTERFACE_URL.
// export const MOCK_DNA_CONNECTION =
//   process.env.NODE_ENV === "test" ||
//   process.env.REACT_APP_MOCK_DNA_CONNECTION === "true" ||
//   false;

// Do we need to close ws connection at some point?

let connection;

export const HOLOCHAIN_LOGGING = process.env.NODE_ENV === "development";

export const getConnection = () => {
  if (connection) return connection;

  const { callZome } = initAndGetHolochainClient();

  connection = (instance, zome, func) => async (params) => {
    return await callZome(instance, zome, func)(params);
  };
};

export async function initAndGetHolochainClient() {
  if (holochainClient) return holochainClient;

  try {
    holochainClient = await hcWebClientConnect({
      url: process.env.REACT_APP_DNA_INTERFACE_URL,
      wsClient: { max_reconnects: 0 },
    });

    if (HOLOCHAIN_LOGGING) {
      console.log("🎉 Successfully connected to Holochain!");
    }
    return holochainClient;
  } catch (error) {
    if (HOLOCHAIN_LOGGING) {
      console.log(
        "😞 Holochain client connection failed -- ",
        error.toString()
      );
    }
    throw error;
  }
}

export function parseZomeCallPath(zomeCallPath) {
  const [zomeFunc, zome, instanceId] = zomeCallPath.split("/").reverse();

  return { instanceId, zome, zomeFunc };
}

export function callZome({ id, zome, func }) {
  return async function (args = {}) {
    try {
      // console.log(args);

      let zomeCall;
      // if (MOCK_DNA_CONNECTION) {
      //   zomeCall = mockCallZome(instanceId, zome, zomeFunc);
      // } else {
      await initAndGetHolochainClient();
      zomeCall = holochainClient.callZome(id, zome, func);
      // }

      const rawResult = await zomeCall(args);
      const jsonResult = JSON.parse(rawResult);
      const error =
        get("Err", jsonResult) || get("SerializationError", jsonResult);
      const rawOk = get("Ok", jsonResult);

      var result = rawOk;

      if (error) throw error;

      if (result.constructor.name === "Object" && "code" in result) {
        throw new Error(result.message);
      }

      return result;
    } catch (error) {
      // throw new Error(JSON.stringify(error))
      if (error.Internal) {
        const { message } = JSON.parse(error.Internal);
        throw new Error(message);
      } else {
        throw new Error(JSON.stringify(error));
      }
    }
  };
}
