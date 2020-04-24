/// NB: The tryorama config patterns are still not quite stabilized.
/// See the tryorama README [https://github.com/holochain/tryorama]
/// for a potentially more accurate example

//  TATS: Watch 9:30 to 20:00 of this video from devcamp to know more about tryorama
//　https://www.youtube.com/watch?v=OX9jsY24S9A&list=PLJgZAXKruDXf9QbFzebpPvA0UV7e35OWQ&index=7&t=0s
//  patterned the folder structure from the test files of react-graphql-template
//  for less verbose test output. use TRYORAMA_LOG_LEVEL=error hc test -s

const path = require('path')
const {  Orchestrator, Config, combine, localOnly, tapeExecutor } = require('@holochain/tryorama')

const dnaPath = path.join(__dirname, "../dist/dna.dna.json")

// Instatiate a test orchestrator.
// It comes loaded with a lot default behavior which can be overridden, including:
// * custom conductor spawning
// * custom test result reporting
// * scenario middleware, including integration with other test harnesses
const orchestrator = new Orchestrator({
  middleware: combine(
    // use the tape harness to run the tests, injects the tape API into each scenario
    // as the second argument
    tapeExecutor(require('tape')),

    // specify that all "players" in the test are on the local machine, rather than
    // on remote machines
    localOnly,
  )
})

const dna = Config.dna(dnaPath, 'kizuna_dna')
const conductorConfig = Config.gen(
  {
    kizuna_dna: dna
  },
  {
    // use a sim2h network (see conductor config options for all valid network types)
    // TATS: So sim2h is the simulated network that we use for testing our zome calls. 
    // More info on the video link I shared above. Basically acts like a switchboard that allows
    // 2 agents to talk to one another.
    // IMPORTANT: Make sure to open a new terminal and get inside the nix-shell and run 'sim2h-server'
    // to instantiate a sim2h_server. Default server is 9000.
    network: {
      type: 'sim2h',
      sim2h_url: 'ws://localhost:9000',
    },
  })

require('./profiles')(orchestrator.registerScenario, conductorConfig)

orchestrator.run()
