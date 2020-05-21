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

export const HOLOCHAIN_LOGGING = process.env.NODE_ENV === "development";

async function initAndGetHolochainClient() {
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

export const callZome = (
  { instanceId, zome, zomeFunction },
  opts = {}
) => async (args = {}) => {
  try {
    await initAndGetHolochainClient();
    holochainClient
      .callZome(
        instanceId,
        zome,
        zomeFunction
      )(args)
      .then((res) => {
        console.log(res);
        const final = JSON.parse(res);
        const { Err, SerializationError, Ok } = final;
        const err = Err || SerializationError;
        if (err) throw err;

        if ({ logging: HOLOCHAIN_LOGGING, ...opts }.loggging) {
          const detailsFormat = "font-weight: bold; color: rgb(220, 208, 120)";

          console.groupCollapsed(
            `👍 ${instanceId}/${zome}/${zomeFunction}%c zome call complete`,
            "font-weight: normal; color: rgb(160, 160, 160)"
          );
          console.groupCollapsed("%cArgs", detailsFormat);
          console.log(args);
          console.groupEnd();
          console.groupCollapsed("%cResult", detailsFormat);
          console.log(Ok);
          console.groupEnd();
          console.groupEnd();

          return Ok;
        }
      });
  } catch (error) {
    console.log(
      `👎 %c${instanceId}/${zome}/${zomeFunction}%c zome call ERROR using args: `,
      "font-weight: bold; color: rgb(220, 208, 120); color: red",
      "font-weight: normal; color: rgb(160, 160, 160)",
      args,
      " -- ",
      error
    );
  }
};

export function createZomeCall(zomeCallPath, callOpts = {}) {
  const DEFAULT_OPTS = {
    logging: HOLOCHAIN_LOGGING,
  };
  const opts = {
    ...DEFAULT_OPTS,
    ...callOpts,
  };

  return async function (args = {}) {
    try {
      // console.log(args);
      const { instanceId, zome, zomeFunc } = parseZomeCallPath(zomeCallPath);
      let zomeCall;
      // if (MOCK_DNA_CONNECTION) {
      //   zomeCall = mockCallZome(instanceId, zome, zomeFunc);
      // } else {
      await initAndGetHolochainClient();
      zomeCall = holochainClient.callZome(instanceId, zome, zomeFunc);
      // }

      const rawResult = await zomeCall(args);
      const jsonResult = JSON.parse(rawResult);
      const error =
        get("Err", jsonResult) || get("SerializationError", jsonResult);
      const rawOk = get("Ok", jsonResult);

      if (error) throw error;

      const result = rawOk;

      if (opts.logging) {
        const detailsFormat = "font-weight: bold; color: rgb(220, 208, 120)";

        console.groupCollapsed(
          `👍 ${zomeCallPath}%c zome call complete`,
          "font-weight: normal; color: rgb(160, 160, 160)"
        );
        console.groupCollapsed("%cArgs", detailsFormat);
        console.log(args);
        console.groupEnd();
        console.groupCollapsed("%cResult", detailsFormat);
        console.log(result);
        console.groupEnd();
        console.groupEnd();
      }
      return result;
    } catch (error) {
      console.log(
        `👎 %c${zomeCallPath}%c zome call ERROR using args: `,
        "font-weight: bold; color: rgb(220, 208, 120); color: red",
        "font-weight: normal; color: rgb(160, 160, 160)",
        args,
        " -- ",
        error
      );
    }
  };
}
