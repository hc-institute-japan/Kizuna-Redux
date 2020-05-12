module.exports = (scenario, conductorConfig) => {
    // Register a scenario, which is a function that gets a special API injected in
    // TATS: this first line is just a boiler plate then sa string you can just specify what scenario you are creating 
  scenario("create_profile", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_profile_result_alice　= await alice.call("profiles", "profiles", "create_profile", {"username":"aLiCeGiRl"})
    const create_profile_result_bob = await bob.call("profiles", "profiles", "create_profile", {"username":"Alexander"})
    await s.consistency()
    // TATS: check if all calls above returns Ok from rust
    await s.consistency()
    t.deepEqual(create_profile_result_bob.Ok.username, "Alexander")
    t.ok(create_profile_result_alice.Ok)
  })

  scenario("validate_create_profile", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_profile_result_alice = await alice.call("profiles", "profiles", "create_profile", {"username":"alice123"})
    await s.consistency()
    // committing the profile entry for the second time for the same agent
    const invalid_create_profile_result_alice = await alice.call("profiles", "profiles", "create_profile", {"username":"alice1234"})
    // committing a non-unique username
    const invalid_create_profile_result_bob = await bob.call("profiles", "profiles", "create_profile", {"username":"alice123"})
    await s.consistency()
    // second commit on public profile which should return Err
    const invalid_create_public_profile_result_alice = await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"abababa"
    }})
    // committing public profile before committing private profile
    const invalid_create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"test"
    }})
    const create_private_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
    "first_name":"bob",
    "last_name":"marley",
    "email":"okay@abc.com"
    }})
    await s.consistency()
    // non-unique username
    const username_invalid_create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
    await s.consistency()
    t.ok(create_private_profile_result_alice.Ok)
    let err_1 = JSON.parse(invalid_create_private_profile_result_alice.Err.Internal)
    let err_2 = JSON.parse(email_invalid_create_private_profile_result_bob.Err.Internal)
    t.deepEqual(err_1.kind, {"ValidationFailed":"This agent already has a private profile"})
    t.deepEqual(err_2.kind, {"ValidationFailed":"Email is already registered"})
    t.ok(create_public_profile_result_alice.Ok)
    let err_3 = JSON.parse(invalid_create_public_profile_result_alice.Err.Internal)
    let err_4 = JSON.parse(invalid_create_public_profile_result_bob.Err.Internal)
    t.deepEqual(err_3.kind, {"ValidationFailed":"This agent already has a public profile"})
    t.deepEqual(err_4.kind, {"ValidationFailed":"A private profile for this user does not exist yet."})
    t.ok(create_private_profile_result_bob.Ok)
    let err_5 = JSON.parse(username_invalid_create_public_profile_result_bob.Err.Internal)
    t.deepEqual(err_5.kind, {"ValidationFailed":"Username is already registered"})
  })

  scenario("get_profile", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_profile_result_alice　= await alice.call("profiles", "profiles", "create_profile", {"username":"alice123"})
    await s.consistency()
    const invalid_create_profile_result_alice = await alice.call("profiles", "profiles", "create_profile", {"username":"alice1234"})
    const invalid_create_profile_result_bob = await bob.call("profiles", "profiles", "create_profile", {"username":"alice123"})
    await s.consistency()
    const get_all_agents_result = await alice.call("profiles", "profiles", "get_all_agents", {})
    const get_my_address_result = await alice.call("profiles", "profiles", "get_my_address", {})
    const get_username_alice_result = await alice.call("profiles", "profiles", "get_username", {"agent_address": get_my_address_result.Ok})
    t.deepEqual(get_all_agents_result.Ok.length, 1)
    t.deepEqual(get_username_alice_result.Ok, "alice123")
  })

//   scenario("list_profiles", async (s, t) => {
//     const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
//     const create_public_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
//         "username":"aLiCeGiRl"
//     }})
//     const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
//         "username":"Alexander"
//     }})
//     // TATS: we're testing here the list_profiles fucntion
//     await s.consistency() 
//     const list_result_a = await bob.call("kizuna_dna", "profile", "list_public_profiles", {"username": "Alice"})
//     // check for if the array returned has a length of 2
//     t.deepEqual(list_result_a.Ok.length, 2)
//   })
}