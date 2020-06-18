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

function listBlocked() {
  return (caller) => caller.call("lobby", "contacts", "list_blocked", {});
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
    t.deepEqual(add_contact_result.Ok.agent_id, bobAddress);
    t.deepEqual(add_contact_result.Ok.username, "bob");
    t.deepEqual(add_contact_result_2.Ok.agent_id, aliceAddress);
    t.deepEqual(add_contact_result_2.Ok.username, "alice");

    // t.deepEqual(invalid_add_contact_result.Err.Internal, {
    //   Internal: "This address is already added in contacts",
    // });
    // t.deepEqual(invalid_add_contact_result_2.Err, {
    //   Internal:
    //     "The timestamp is the same with or less than the previous timestamp",
    // });

    t.deepEqual(JSON.parse(invalid_add_contact_result.Err.Internal).code, "402");
    t.deepEqual(JSON.parse(invalid_add_contact_result.Err.Internal).message, "This address is already added in contacts");

    t.deepEqual(JSON.parse(invalid_add_contact_result_2.Err.Internal).code, "321");
    t.deepEqual(JSON.parse(invalid_add_contact_result_2.Err.Internal).message, "The timestamp is the same with or less than the previous timestamp");
    
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

    const remove_contact_alice_result = await removeContacts("bob", 3)(alice);
    // no address exisiting
    const invalid_remove_1 = await removeContacts("bob", 4)(alice);
    // timestamp invalid
    const invalid_remove_2 = await removeContacts("alice", 3)(alice);
    t.ok(add_contact_alice_result.Ok);
    t.ok(add_contact_alice_result_2.Ok);

    // t.deepEqual(invalid_remove_1.Err, {
    //   Internal: "This address wasn't found in the contract",
    // });
    // t.deepEqual(invalid_remove_2.Err, {
    //   Internal:
    //     "The timestamp is the same with or less than the previous timestamp",
    // });

    t.deepEqual(JSON.parse(invalid_remove_1.Err.Internal).code, "404");
    t.deepEqual(JSON.parse(invalid_remove_1.Err.Internal).message, "This address wasn't found in contacts");

    t.deepEqual(JSON.parse(invalid_remove_2.Err.Internal).code, "321");
    t.deepEqual(JSON.parse(invalid_remove_2.Err.Internal).message, "The timestamp is the same with or less than the previous timestamp");
    
    t.deepEqual(remove_contact_alice_result.Ok.agent_id, bobAddress);
    t.deepEqual(remove_contact_alice_result.Ok.username, "bob");
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

    const empty_list_contacts = await listContacts()(alice);
    const add_contact_alice_result = await addContacts("bob", 1)(alice);
    await s.consistency();
    const add_contact_alice_result_2 = await addContacts("alice", 2)(alice);
    await s.consistency();
    const list_contacts = await listContacts()(alice);

    t.ok(add_contact_alice_result.Ok);
    t.ok(add_contact_alice_result_2.Ok);
    t.deepEqual(empty_list_contacts.Ok.length, 0);
    t.deepEqual(list_contacts.Ok.length, 2);
  });

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

    await setUsername("alice")(alice);
    await setUsername("bob")(bob);
    await setUsername("charlie")(charlie);
    await s.consistency();

    //BLOCK OWN SELF
    const invalid_block_contact_result_0 = await blockContact(
      "alice",
      0
    )(alice);
    await s.consistency();
    // t.deepEqual(invalid_block_contact_result_0.Err, {
    //   Internal: "Cannot block own agent id.",
    // });

    t.deepEqual(JSON.parse(invalid_block_contact_result_0.Err.Internal).code, "302");
    t.deepEqual(JSON.parse(invalid_block_contact_result_0.Err.Internal).message, "Cannot block own agent id.");

    //BLOCK A CONTACT NOT IN CONTACTS (ALSO INSTANTIATES CONTACTS)
    const block_contact_result_0 = await blockContact("charlie", 0)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result_0.Ok.agent_id, charlieAddress);
    t.deepEqual(block_contact_result_0.Ok.username, "charlie");

    //BLOCK A CONTACT IN CONTACTS
    const add_contact_result = await addContacts("bob", 1)(alice);
    await s.consistency();
    const block_contact_result = await blockContact("bob", 2)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result.Ok.agent_id, bobAddress);
    t.deepEqual(block_contact_result.Ok.username, "bob");

    //UPDATE BLOCKED LIST WITH AN INVALID TIMESTAMP
    const invalid_block_contact_result_1 = await blockContact("bob", 1)(alice);
    await s.consistency();
    // t.deepEqual(invalid_block_contact_result_1.Err, {
    //   Internal:
    //     "The timestamp is the same with or less than the previous timestamp",
    // });

    t.deepEqual(JSON.parse(invalid_block_contact_result_1.Err.Internal).code, "321");
    t.deepEqual(JSON.parse(invalid_block_contact_result_1.Err.Internal).message, "The timestamp is the same with or less than the previous timestamp");

    //BLOCK AN ALREADY BLOCKED CONTACT
    const invalid_block_contact_result_2 = await blockContact("bob", 3)(alice);
    await s.consistency();
    // t.deepEqual(invalid_block_contact_result_2.Err, {
    //   Internal: "The contact is already in the list of blocked contacts",
    // });

    t.deepEqual(JSON.parse(invalid_block_contact_result_2.Err.Internal).code, "402");
    t.deepEqual(JSON.parse(invalid_block_contact_result_2.Err.Internal).message, "The contact is already in the list of blocked contacts");
  });

  scenario("unblock contact", async (s, t) => {
    const { alice, bob } = await s.players(
      { alice: conductorConfig, bob: conductorConfig },
      true
    );
    const aliceAddress = alice.instance("lobby").agentAddress;
    const bobAddress = bob.instance("lobby").agentAddress;

    await setUsername("alice")(alice);
    await setUsername("bob")(bob);
    await s.consistency();

    await addContacts("bob", 1)(alice);
    await s.consistency();

    const block_contact_result = await blockContact("bob", 2)(alice);
    await s.consistency();
    t.deepEqual(block_contact_result.Ok.agent_id, bobAddress);
    t.deepEqual(block_contact_result.Ok.username, "bob");

    //UNBLOCK BLOCKED CONTACT
    const unblock_contact_result = await unblockContact("bob", 3)(alice);
    await s.consistency();
    t.deepEqual(unblock_contact_result.Ok.agent_id, bobAddress);
    t.deepEqual(unblock_contact_result.Ok.username, "bob");

    //UPDATE BLOCKED LIST WITH AN INVALID TIMESTAMP
    const invalid_unblock_contact_result_1 = await unblockContact(
      "bob",
      1
    )(alice);
    await s.consistency();
    // t.deepEqual(invalid_unblock_contact_result_1.Err, {
    //   Internal:
    //     "The timestamp is the same with or less than the previous timestamp",
    // });

    t.deepEqual(JSON.parse(invalid_unblock_contact_result_1.Err.Internal).code, "321");
    t.deepEqual(JSON.parse(invalid_unblock_contact_result_1.Err.Internal).message, "The timestamp is the same with or less than the previous timestamp");    

    //UNBLOCK AN UNBLOCKED CONTACT
    const invalid_unblock_contact_result_2 = await unblockContact(
      "bob",
      4
    )(alice);
    await s.consistency();
    // t.deepEqual(invalid_unblock_contact_result_2.Err, {
    //   Internal: "The contact is not in the list of blocked contacts",
    // });

    t.deepEqual(JSON.parse(invalid_unblock_contact_result_2.Err.Internal).code, "404");
    t.deepEqual(JSON.parse(invalid_unblock_contact_result_2.Err.Internal).message, "The contact is not in the list of blocked contacts");
  });

  scenario("list blocked contacts", async (s, t) => {
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

    const add_contact_alice_result = await setUsername("alice")(alice);
    const add_contact_alice_result_2 = await setUsername("bob")(bob);
    const add_contact_alice_result_3 = await setUsername("charlie")(charlie);
    await s.consistency();

    const empty_list_blocked = await listContacts()(alice);
    await blockContact("bob", 1)(alice);
    await s.consistency();
    await blockContact("charlie", 2)(alice);
    await s.consistency();
    const list_blocked = await listBlocked()(alice);

    t.ok(add_contact_alice_result.Ok);
    t.ok(add_contact_alice_result_2.Ok);
    t.ok(add_contact_alice_result_3.Ok);
    t.deepEqual(empty_list_blocked.Ok.length, 0);
    t.deepEqual(list_blocked.Ok.length, 2);
  });
};
