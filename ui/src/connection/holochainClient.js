import { connect as hcWebClientConnect } from "@holochain/hc-web-client";
import { get } from "lodash/fp";
import { MicroOrchestrator } from "@uprtcl/micro-orchestrator";
import {
  HolochainConnectionModule,
  HolochainConnection,
} from "@uprtcl/holochain-provider";

let holochainClient;
let holochainUprtclClient;

// NB: This should be set to false when you want to run against a Holochain Conductor
// with a websocket interface running on REACT_APP_DNA_INTERFACE_URL.
export const MOCK_DNA_CONNECTION =
  process.env.NODE_ENV === "test" ||
  process.env.REACT_APP_MOCK_DNA_CONNECTION === "true" ||
  false;

// Do we need to close ws connection at some point?

export const HOLOCHAIN_LOGGING = process.env.NODE_ENV === "development";

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

export async function onSignal(callback) {
  await initAndGetHolochainClient();
  holochainClient.onSignal(callback);
}

export function callZome({ id, zome, func }) {
  return async function (args = {}) {
    try {
      let zomeCall;

      await initAndGetHolochainClient();
      zomeCall = holochainClient.callZome(id, zome, func);

      const rawResult = await zomeCall(args);
      const jsonResult = JSON.parse(rawResult);
      const error =
        get("Err", jsonResult) || get("SerializationError", jsonResult);
      const rawOk = get("Ok", jsonResult);
      const result = rawOk;

      if (error) throw error;

      return result;
    } catch (e) {
      const { Internal, Timeout } = { ...e };
      if (Internal) {
        const err = JSON.parse(Internal);
        if (err.constructor.name === "Object" && "code" in err) {
          throw new Error(JSON.stringify(err));
        }
      } else if (Timeout) {
        throw new Error(
          JSON.stringify({
            code: 502,
            message: "Timeout",
          })
        );
      }

      throw new Error(
        JSON.stringify({
          code: 1000,
          message: "Filler",
        })
      );
    }
  };
}

export function callAdmin( adminFn ) {
  return async function (args = {}) {
    try {
      let adminCall;

      await initAndGetHolochainClient();
      adminCall = holochainClient.call(adminFn);

      const rawResult = await adminCall(args);

      return rawResult;
    } catch (e) {
      // const { error } = { ...e };

      console.log(e);

      // if (Internal) {
      //   const err = JSON.parse(Internal);
      //   if (err.constructor.name === "Object" && "code" in err) {
      //     throw new Error(JSON.stringify(err));
      //   }
      // } else if (Timeout) {
      //   throw new Error(
      //     JSON.stringify({
      //       code: 502,
      //       message: "Timeout",
      //     })
      //   );
      // }

      throw new Error(
        JSON.stringify({
          code: 1000,
          message: "Filler",
        })
      );
    }
  };
}

// see https://github.com/uprtcl/js-uprtcl/tree/master/providers/holochain
export async function hcUprtcl() {
  await initAndGetHolochainClient();
  if (holochainUprtclClient) return holochainUprtclClient;
  holochainUprtclClient = new HolochainConnection({
    host: process.env.REACT_APP_DNA_INTERFACE_URL,
    devEnv: {
      // this property should be changed to your local paths and dna hash
      templateDnasPaths: {
        mWMcdbwrkFwMWsd836se32cwD2SRgHx8KY8qP4PoFpVwc :
          "/home/holo/Desktop/KizunaMain/Kizuna/dnas/p2pcomm/dist/p2pcomm.dna.json",
      },
    },
  });

  const hcModule = new HolochainConnectionModule(holochainUprtclClient);

  const orchestrator = new MicroOrchestrator();

  await orchestrator.loadModule(hcModule);
  return holochainUprtclClient;
}
