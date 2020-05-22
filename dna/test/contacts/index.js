function addContacts(username, timestamp) {
  return (caller) =>
    caller.call("lobby", "contacts", "add_contact", {
      // contact_address,
      username,
      timestamp,
    });
}

function removeContacts(username, timestamp) {
  return (caller) =>
    caller.call("lobby", "contacts", "remove_contact", {
      // contact_address,
      username,
      timestamp,
    });
}

function listContacts() {
  return (caller) => caller.call("lobby", "contacts", "list_contacts", {});
}

function setUsername(username) {
  return (caller) =>
    caller.call("lobby", "profiles", "set_username", {
      username,
    });
}

function blockContact(username, timestamp) {
  return (caller) =>
    caller.call("lobby", "contacts", "block", {
      username,
      timestamp,
    });
}

function unblockContact(username, timestamp) {
  return (caller) =>
    caller.call("lobby", "contacts", "unblock", {
      username,
      timestamp,
    });
}

module.exports = (scenario, conductorConfig) => {
  scenario("add a contact", async (s, t) => {
    const { alice, bob } = await s.players(
      { alice: conductorConfig, bob: conductorConfig },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;

    const set_username_alice = await setUsername("alice")(alice);
    const set_username_bob = await setUsername("bob")(bob);
    await s.consistency();

    const add_contact_result = await addContacts("bob", 1)(alice);
    await s.consistency();

    // committing the same address
    const invalid_add_contact_result = await addContacts("bob", 2)(alice);
    // committing with the same timestamp
    const invalid_add_contact_result_2 = await addContacts("alice", 1)(alice);

    await s.consistency();
    const add_contact_result_2 = await addContacts("alice", 2)(alice);

    await s.consistency();
    t.deepEqual(add_contact_result.Ok.contacts.length, 1);
    t.deepEqual(add_contact_result_2.Ok.contacts.length, 2);
    t.deepEqual(invalid_add_contact_result.Err, {
      Internal: "This address is already added in contacts",
    });
    t.deepEqual(invalid_add_contact_result_2.Err, {
      Internal:
        "The timestamp is the same with or less than the previous timestamp",
    });
  });

  scenario("remove a contact", async (s, t) => {
    const { alice, bob } = await s.players(
      { alice: conductorConfig, bob: conductorConfig },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;

    const set_username_alice = await setUsername("alice")(alice);
    const set_username_bob = await setUsername("bob")(bob);
    await s.consistency();

    const add_contact_alice_result = await addContacts("bob", 1)(alice);
    await s.consistency();
    const add_contact_alice_result_2 = await addContacts("alice", 2)(alice);
    await s.consistency();

    const remove_contact_alice_reult = await removeContacts("bob", 3)(alice);
    // no address exisiting
    const invalid_remove_1 = await removeContacts("bob", 4)(alice);
    // timestamp invalid
    const invalid_remove_2 = await removeContacts("alice", 3)(alice);
    t.ok(add_contact_alice_result.Ok);
    t.ok(add_contact_alice_result_2.Ok);
    t.deepEqual(invalid_remove_1.Err, {
      Internal: "This address wasn't found in the contract",
    });
    t.deepEqual(invalid_remove_2.Err, {
      Internal:
        "The timestamp is the same with or less than the previous timestamp",
    });
    t.deepEqual(remove_contact_alice_reult.Ok.contacts.length, 1);
  });

  scenario("list contacts", async (s, t) => {
    const { alice, bob } = await s.players(
      { alice: conductorConfig, bob: conductorConfig },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;

    const set_username_alice = await setUsername("alice")(alice);
    const set_username_bob = await setUsername("bob")(bob);
    await s.consistency();

    const error_list_contacts = await listContacts()(alice);
    const add_contact_alice_result = await addContacts("bob", 1)(alice);
    await s.consistency();
    const add_contact_alice_result_2 = await addContacts("alice", 2)(alice);
    await s.consistency();
    const list_contacts = await listContacts()(alice);

    t.ok(add_contact_alice_result.Ok);
    t.ok(add_contact_alice_result_2.Ok);
    t.deepEqual(error_list_contacts.Err, {
      Internal: "This agent has no contacts entry",
    });
    t.deepEqual(list_contacts.Ok.length, 2);
  });

  // scenario("get user address", async (s, t) => {
  //   const {alice} = await s.players({alice: conductorConfig}, true);
  //   const aliceAddress = alice.instance("lobby").agentAddress;
  //   // const bobAddress = bob.instance("lobby").agentAddress;

  //   const set_username_result_alice　= await setUsername("alice")(alice);
  //   await s.consistency()

  //   const get_user_address = await usernameAddress("alice")(alice);
  //   await s.consistency();

  //   console.log("return nicko");
  //   console.log(get_user_address.Ok)

  //   t.ok(get_user_address.Ok)
  //   t.deepEqual(get_user_address.Ok, aliceAddress)
  //   t.deepEqual(get_user_address.Err, undefined)

  //   const get_user_address_invalid = await usernameAddress("bob")(alice);
  //   await s.consistency()

  //   console.log("return invalid")
  //   console.log(get_user_address_invalid.Ok)

  //   console.log("nicko2")
  //   console.log(get_user_address_invalid)
  //   t.deepEqual(get_user_address_invalid.Err != undefined, true)

  // })

  scenario("block contact", async (s, t) => {
    const { alice, bob, charlie } = await s.players(
      {
        alice: conductorConfig,
        bob: conductorConfig,
        charlie: conductorConfig,
      },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;
    const charlieAddress = charlie.instance("lobby").agentAddress;

    const set_username_alice = await setUsername("alice")(alice);
    const set_username_bob = await setUsername("bob")(bob);
    const set_username_charlie = await setUsername("charlie")(charlie);
    await s.consistency();

    //BLOCK OWN SELF
    const invalid_block_contact_result_0 = await blockContact(
      "alice",
      0
    )(alice);
    await s.consistency();
    t.deepEqual(invalid_block_contact_result_0.Err, {
      Internal: "Cannot block yourself",
    });

    //BLOCK A CONTACT NOT IN CONTACTS (ALSO INSTANTIATES CONTACTS)
    const block_contact_result_0 = await blockContact("charlie", 0)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result_0.Ok.blocked.length, 1);
    t.deepEqual(block_contact_result_0.Ok.blocked[0], charlieAddress);
    t.deepEqual(block_contact_result_0.Ok.contacts.length, 0);

    //BLOCK A CONTACT IN CONTACTS
    const add_contact_result = await addContacts("bob", 1)(alice);
    await s.consistency();
    const block_contact_result = await blockContact("bob", 2)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result.Ok.blocked.length, 2);
    t.deepEqual(block_contact_result.Ok.blocked[1], bobAddress);
    t.deepEqual(block_contact_result.Ok.contacts.length, 0);

    //UPDATE BLOCKED LIST WITH AN INVALID TIMESTAMP
    const invalid_block_contact_result_1 = await blockContact("bob", 1)(alice);
    await s.consistency();
    t.deepEqual(invalid_block_contact_result_1.Err, {
      Internal:
        "The timestamp is the same with or less than the previous timestamp",
    });

    //BLOCK AN ALREADY BLOCKED CONTACT
    const invalid_block_contact_result_2 = await blockContact("bob", 3)(alice);
    await s.consistency();
    t.deepEqual(invalid_block_contact_result_2.Err, {
      Internal: "The contact is already in the list of blocked contacts",
    });
  });

  scenario("unblock contact", async (s, t) => {
    const { alice, bob } = await s.players(
      { alice: conductorConfig, bob: conductorConfig },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;

    const set_username_alice = await setUsername("alice")(alice);
    const set_username_bob = await setUsername("bob")(bob);
    await s.consistency();

    const add_contact_result = await addContacts("bob", 1)(alice);
    await s.consistency();

    const block_contact_result = await blockContact("bob", 2)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result.Ok.blocked.length, 1);

    //UNBLOCK BLOCKED CONTACT
    const unblock_contact_result = await unblockContact("bob", 3)(alice);
    await s.consistency();
    t.deepEqual(unblock_contact_result.Ok.blocked.length, 0);

    //UPDATE BLOCKED LIST WITH AN INVALID TIMESTAMP
    const invalid_unblock_contact_result_1 = await unblockContact(
      "bob",
      1
    )(alice);
    await s.consistency();
    t.deepEqual(invalid_unblock_contact_result_1.Err, {
      Internal:
        "The timestamp is the same with or less than the previous timestamp",
    });

    //UNBLOCK AN UNBLOCKED CONTACT
    const invalid_unblock_contact_result_2 = await unblockContact(
      "bob",
      4
    )(alice);
    await s.consistency();
    t.deepEqual(invalid_unblock_contact_result_2.Err, {
      Internal: "The contact is not in the list of blocked contacts",
    });
  });
};
