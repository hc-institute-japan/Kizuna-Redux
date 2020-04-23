module.exports = (scenario, conductorConfig) => {
    // Register a scenario, which is a function that gets a special API injected in
    // TATS: this first line is just a boiler plate then sa string you can just specify what scenario you are creating 
  scenario("create_profile", async (s, t) => {
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
    const create_public_profile_result_bob = await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"Alexander"
    }})

    // TATS: check if all calls above returns Ok from rust
    await s.consistency()
    t.ok(create_private_profile_result_alice.Ok)
    t.ok(create_private_profile_result_bob.Ok)
    t.deepEqual(create_public_profile_result_bob.Ok.username, "Alexander")
    t.ok(create_public_profile_result_alice.Ok)
  })

  scenario("get_profile", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_private_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"bob",
        "last_name":"test",
        "email":"abc@abc.com"
    }})
    const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"Alexander"
    }})
    await s.consistency()
    // TATS: now, let's try to get the entry content created with the result with bob and alice using get_public_profile/get_private_profile call
    // the public/private/profile_result__addr.Ok.id contains the address of the profile entry committed since create_pub/private_profile returns
    // a profile struct with its id field having the address of the committed entry. 
    const get_pub_profile_result = await alice.call("kizuna_dna", "profile", "get_public_profile", {"id": create_public_profile_result_bob.Ok.id})
    const get_private_profile_result = await alice.call("kizuna_dna", "profile", "get_private_profile", {"id": create_private_profile_result_bob.Ok.id})
    t.deepEqual(get_pub_profile_result, { Ok: { id: create_public_profile_result_bob.Ok.id, username: 'Alexander'} })
    t.deepEqual(get_private_profile_result, { Ok: { id: create_private_profile_result_bob.Ok.id, first_name: 'bob', last_name:'test', email:'abc@abc.com'} })
  })

  scenario("list_profiles", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_public_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
    const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"Alexander"
    }})
    // TATS: we're testing here the list_profiles fucntion
    await s.consistency() 
    const list_result_a = await bob.call("kizuna_dna", "profile", "list_public_profiles", {"username": "Alice"})
    // check for if the array returned has a length of 2
    t.deepEqual(list_result_a.Ok.length, 2)
  })

  scenario("check_username", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_public_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
    const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"Alexander"
    }})
    await s.consistency() 
    const search_username_result = await bob.call("kizuna_dna", "profile", "search_username", {"username": "ALicegirl"})
    const search_username_result_2 = await alice.call("kizuna_dna", "profile", "search_username", {"username": "alEXANder"})
    const search_username_result_none = await alice.call("kizuna_dna", "profile", "search_username", {"username": "bobaba"})
    await s.consistency() 
    t.deepEqual(search_username_result, {Ok: [{ id: create_public_profile_result_alice.Ok.id, username: 'aLiCeGiRl' }]})
    t.deepEqual(search_username_result_2, {Ok: [{ id: create_public_profile_result_bob.Ok.id, username: 'Alexander' }]})
    t.deepEqual(search_username_result_none, {Ok: []})
  })
}
