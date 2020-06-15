/// NB: The tryorama config patterns are still not quite stabilized.
/// See the tryorama README [https://github.com/holochain/tryorama]
/// for a potentially more accurate example

//  for less verbose test output. use TRYORAMA_LOG_LEVEL=error hc test

const path = require("path");

const {
  Orchestrator,
  Config,
  combine,
  singleConductor,
  localOnly,
  tapeExecutor,
} = require("@holochain/tryorama");

process.on("unhandledRejection", (error) => {
  // Will print "unhandledRejection err is not defined"
  console.error("got unhandledRejection:", error);
});

const dnaPath = path.join(__dirname, "../dist/lobby.dna.json");

const dna = Config.dna(dnaPath, "scaffold-test");
const conductorConfig = Config.gen(
  { lobby: dna },
  {
    network: {
      type: "sim2h",
      sim2h_url: "ws://localhost:9000",
    },
  }
);

const orchestrator = new Orchestrator({
  waiter: {
    softTimeout: 20000,
    hardTimeout: 30000,
  },
});

require('./profiles')(orchestrator.registerScenario, conductorConfig)
require('./contacts')(orchestrator.registerScenario, conductorConfig)

orchestrator.run();
