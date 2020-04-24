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
        "email":"test@abc.com"
    }})
    const create_public_profile_result_alice= await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
    const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"Alexander"
    }})

    // TATS: check if all calls above returns Ok from rust
    await s.consistency()
    t.ok(create_private_profile_result_alice.Ok)
    t.ok(create_private_profile_result_bob.Ok)
    t.deepEqual(create_public_profile_result_bob.Ok.username, "Alexander")
    t.ok(create_public_profile_result_alice.Ok)    
  })

  scenario("validate_create_profile", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    const create_private_profile_result_alice = await alice.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"alice",
        "last_name":"test",
        "email":"abc@abc.com"
    }})
    await s.consistency()
    // second commit on private profile which should return Err
    const invalid_create_private_profile_result_alice = await alice.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"haha",
        "last_name":"hahaha",
        "email":"hahaha@haha.com"
    }})
    // non-unique email
    const email_invalid_create_private_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"bob",
        "last_name":"test",
        "email":"abc@abc.com"
    }})
    const create_public_profile_result_alice = await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
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

  scenario("is_username_registered", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    await alice.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
        "username":"aLiCeGiRl"
    }})
    await s.consistency() 
    const is_username_registered_result = await bob.call("kizuna_dna", "profile", "is_username_registered", {"username": "ALicegirl"})
    const is_username_registered_result_none = await alice.call("kizuna_dna", "profile", "is_username_registered", {"username": "bobaba"})
    await s.consistency() 
    t.deepEqual(is_username_registered_result, {Ok: { value: true}})
    t.deepEqual(is_username_registered_result_none, {Ok: { value: false}})
  })

  scenario("is_email_registered", async (s, t) => {
    const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
    await alice.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"alice",
        "last_name":"test",
        "email":"abc@abc.com"
    }})
    await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
        "first_name":"bob",
        "last_name":"test",
        "email":"abcabc@abc.com"
    }})
    await s.consistency() 
    const is_email_registered_result = await bob.call("kizuna_dna", "profile", "is_email_registered", {"email": "abc@abc.com"})
    const is_email_registered_result_none = await alice.call("kizuna_dna", "profile", "is_email_registered", {"email": "test@test.com"})
    await s.consistency()
    t.deepEqual(is_email_registered_result, {Ok: { value: true}})
    t.deepEqual(is_email_registered_result_none, {Ok: { value: false}})
  })

//   scenario("get_profile", async (s, t) => {
//     const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true)
//     const create_private_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_private_profile", {"input" : {
//         "first_name":"bob",
//         "last_name":"test",
//         "email":"abc@abc.com"
//     }})
//     const create_public_profile_result_bob = await bob.call("kizuna_dna", "profile", "create_public_profile", {"input" : {
//         "username":"Alexander"
//     }})
//     await s.consistency()
//     // TATS: now, let's try to get the entry content created with the result with bob and alice using get_public_profile/get_private_profile call
//     // the public/private/profile_result__addr.Ok.id contains the address of the profile entry committed since create_pub/private_profile returns
//     // a profile struct with its id field having the address of the committed entry. 
//     const get_pub_profile_result = await alice.call("kizuna_dna", "profile", "get_public_profile", {"id": create_public_profile_result_bob.Ok.id})
//     const get_private_profile_result = await alice.call("kizuna_dna", "profile", "get_private_profile", {"id": create_private_profile_result_bob.Ok.id})
//     t.deepEqual(get_pub_profile_result, { Ok: { id: create_public_profile_result_bob.Ok.id, username: 'Alexander'} })
//     t.deepEqual(get_private_profile_result, { Ok: { id: create_private_profile_result_bob.Ok.id, first_name: 'bob', last_name:'test', email:'abc@abc.com'} })
//   })

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
