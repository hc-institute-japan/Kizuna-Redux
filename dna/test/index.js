/// NB: The tryorama config patterns are still not quite stabilized.
/// See the tryorama README [https://github.com/holochain/tryorama]
/// for a potentially more accurate example

//  TATS: Watch 9:30 to 20:00 of this video from devcamp to know more about tryorama
//　https://www.youtube.com/watch?v=OX9jsY24S9A&list=PLJgZAXKruDXf9QbFzebpPvA0UV7e35OWQ&index=7&t=0s

const path = require('path')
const { Orchestrator, Config} = require('@holochain/tryorama')

const dnaPath = path.join(__dirname, "../dist/dna.dna.json")

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

// Instatiate a test orchestrator.
// It comes loaded with a lot default behavior which can be overridden, including:
// * custom conductor spawning
// * custom test result reporting
// * scenario middleware, including integration with other test harnesses
const orchestrator = new Orchestrator()

// Register a scenario, which is a function that gets a special API injected in
// TATS: this first line is just a boiler plate then sa string you can just specify what scenario you are creating 
orchestrator.registerScenario("call create_profile, get_profile, list_profiles", async (s, t) => {

  // Declare two players using the previously specified config,
  // and nickname them "alice" and "bob"
  // TATS: yung true na second argument is just saying the conductor for each of these 
  // test agents should be auto-spawned. If no arguemnt true is passed in the second arguemnt, then
  // you have to call await alice.spawn() to spawn the conductor yourself and kill it after the scenario 
  // with await alice.kill()
  const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)

  // Make a call to a Zome function create_profile
  // indicating the function, and passing it the argument
  // FROM TATS: the first argument is the nickname I assigned in line 13. then zome name then zome call name.
  const create_private_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
    "first_name":"alice",
    "last_name":"test",
    "email":"abc@abc.com"
  }})
  const create_private_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
    "first_name":"bob",
    "last_name":"test",
    "email":"abc@abc.com"
  }})
  const create_public_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
    "username":"aLiCeGiRl"
  }})
  const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
    "username":"Alexander"
  }})
  //   const create_public_profile_result_charlie = await charlie.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
  //   "username":"ALICE_2"
  // }})

  // TATS: check if all calls above returns Ok from rust
  t.ok(create_private_profile_result_alice.Ok)
  t.ok(create_private_profile_result_bob.Ok)
  t.deepEqual(create_public_profile_result_bob.Ok.username, "Alexander")
  t.ok(create_public_profile_result_alice.Ok)
  // t.ok(create_public_profile_result_charlie.Ok)

  // // Wait for all network activity to settle
  await s.consistency()

  // TATS: now, let's try to get the entry content created with the result with bob and alice using get_public_profile/get_private_profile call
  // the public/private/profile_result__addr.Ok.id contains the address of the profile entry committed since create_pub/private_profile returns
  // a profile struct with its id field having the address of the committed entry. 
  const get_pub_profile_result = await alice.call("kizuna_dna", "profile", "get_public_profile", {"id": create_public_profile_result_bob.Ok.id})
  const get_private_profile_result = await alice.call("kizuna_dna", "profile", "get_private_profile", {"id": create_private_profile_result_bob.Ok.id})
  t.deepEqual(get_pub_profile_result, { Ok: { id: create_public_profile_result_bob.Ok.id, username: 'Alexander'} })
  t.deepEqual(get_private_profile_result, { Ok: { id: create_private_profile_result_bob.Ok.id, first_name: 'bob', last_name:'test', email:'abc@abc.com'} })

  // TATS: we're testing here the list_profiles fucntion
  // Failing for some reason
  const list_result_a = await bob.call("kizuna_dna", "profile", "list_public_profiles", {"username": "Alice"})
  await s.consistency() 
  // check for if the array returned has a length of 2
  t.deepEqual(list_result_a.Ok.length, 2)
  // const list_result_b = await bob.call("kizuna_dna", "profile", "list_public_profiles", {"username": "bobito"})
  // t.deepEqual(list_result_b.Ok.length, 1)
  // const list_result_c = await charlie.call("kizuna_dna", "profile", "list_public_profiles", {"username": "charlie"})
  // t.deepEqual(list_result_c.Ok.length, 1)
  
  const search_username_result = await bob.call("kizuna_dna", "profile", "search_username", {"username": "ALicegirl"})
  const search_username_result_2 = await alice.call("kizuna_dna", "profile", "search_username", {"username": "alEXANder"})
  // const search_username_result_none = await charlie.call("kizuna_dna", "profile", "search_username", {"username": "ronaldo"})
  await s.consistency() 
  t.deepEqual(search_username_result, {Ok: [{ id: create_public_profile_result_alice.Ok.id, username: 'aLiCeGiRl' }]})
  t.deepEqual(search_username_result_2, {Ok: [{ id: create_public_profile_result_bob.Ok.id, username: 'Alexander' }]})
  // t.deepEqual(search_username_result_none, {Ok : []})


  console.log(list_result_a)
  console.log(search_username_result)
  console.log(search_username_result_2)
  // console.log(search_username_result_none)
  console.log(create_private_profile_result_alice)
  console.log(create_private_profile_result_bob)
  console.log(create_public_profile_result_bob)
  console.log(create_public_profile_result_alice)
  // console.log(create_public_profile_result_charlie)

})

orchestrator.run()
