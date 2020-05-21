function setUsername(username) {
  return (caller) =>
    caller.call("lobby", "profiles", "set_username", {
      username,
    });
}

function getUsername(agentAddress) {
  return (caller) =>
    caller.call("lobby", "profiles", "get_username", {
      agent_address: agentAddress,
    });
}

function getAllAgents() {
  return (caller) => caller.call("lobby", "profiles", "get_all_agents", {});
}

function deleteUsername(username) {
  return (caller) => caller.call("lobby", "profiles", "delete_my_username", {"username":username})
}

function getUserAddress(username) {
  return (caller) => caller.call("lobby", "profiles", "get_address_from_username", {
    username: username
  })
}

module.exports = (scenario, conductorConfig) => {
  scenario("set_username", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
    const set_username_result_alice　= await setUsername("aLiCeGiRl")(alice);
    const set_username_result_bob = await setUsername("bob")(bob);
    await s.consistency();
    t.deepEqual(set_username_result_bob.Ok.username, "bob");
    t.deepEqual(set_username_result_alice.Ok.username, "aLiCeGiRl");
  })

  scenario("validate_set_username", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
    const set_username_result_alice = await setUsername("alice")(alice);
    await s.consistency();
    // committing a non-unique username
    const invalid_set_username_result_bob = await setUsername("alice")(bob);
    // committing the username entry for the second time for the same agent 
    const invalid_set_username_result_alice = await setUsername("alice1234")(alice);
    await s.consistency()
    const set_username_result_bob = await setUsername("bob")(bob);
    await s.consistency()
    t.ok(set_username_result_alice.Ok)
    t.deepEqual(invalid_set_username_result_alice.Err, {"Internal":"This agent already has a username"})
    t.deepEqual(invalid_set_username_result_bob.Err, {"Internal":"This username is already existing"})
    t.ok(set_username_result_bob.Ok)
  })

  scenario("get_usernames", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;
    const set_username_result_alice　= await setUsername("alice")(alice);
    await s.consistency()
    const invalid_set_username_result_alice = await setUsername("alice1")(alice);
    const invalid_set_username_result_bob = await setUsername("alice")(bob);
    await s.consistency()
    const set_username_result_bob　= await setUsername("bob")(bob);
    await s.consistency()
    const get_all_agents_result = await getAllAgents()(alice);
    const get_username_alice_result = await getUsername(aliceAddress)(alice);
    t.ok(set_username_result_alice.Ok);
    t.ok(set_username_result_bob.Ok);
    t.deepEqual(get_all_agents_result.Ok.length, 2);
    t.deepEqual(get_username_alice_result.Ok, "alice");
  })

  // scenario("get address from username", async (s, t) => {
  //   const {alice} = await s.players({alice: conductorConfig}, true);
  //   const aliceAddress = alice.instance("lobby").agentAddress;

  //   const set_username_result_alice　= await setUsername("alice")(alice);
  //   await s.consistency()
    
  //   const user_address = await getUserAddress("alice")(alice);
  //   await s.consistency()

  //   t.ok(user_address)
  //   t.deepEqual(user_address, aliceAddress)

  // })

  // scenario("delete_username", async (s, t) => {
  //   const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
  //   const aliceAddress = alice.instance("profiles").agentAddress;
    
  //   // create usernames for alice
  //   const set_username_result_alice　= await setUsername("alice")(alice);
  //   await s.consistency();

  //   // check that the username was created successfully
  //   t.deepEqual(set_username_result_alice.Ok.username, "alice");

  //   // delete alice's profile
  //   const delete_username_result_alice = await deleteUsername("alice")(alice);
  //   s.consistency();

  //   // test return value
  //   t.deepEqual(delete_username_result_alice.Ok, true);
    
  //   // test username deletion
  //   const get_username_result_alice = await getUsername(aliceAddress)(alice);
  //   t.deepEqual(get_username_result_alice.Ok, null);
  // })
}
