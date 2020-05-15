function addContacts(contact_address, timestamp) {
  return (caller) =>
    caller.call("lobby", "contacts", "add_contact", {
      contact_address,
      timestamp,
    });
}

function removeContacts(contact_address, timestamp) {
  return (caller) => 
    caller.call("lobby", "contacts", "remove_contact", {
      contact_address,
      timestamp,
    });
}

function listContacts() {
  return (caller) => 
    caller.call("lobby", "contacts", "list_contacts", {})
}

module.exports = (scenario, conductorConfig) => {
    scenario("add a contact", async (s, t) => {
      const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
      const aliceAddress = alice.instance("lobby").agentAddress;
      const bobAddress = bob.instance("lobby").agentAddress;

      const add_contact_result = await addContacts(bobAddress, 1)(alice);
      await s.consistency();
    
      // committing the same address
      const invalid_add_contact_result = await addContacts(bobAddress, 2)(alice);
      // committing with the same timestamp
      const invalid_add_contact_result_2 = await addContacts(aliceAddress, 1)(alice);
      
      await s.consistency();
      const add_contact_result_2 = await addContacts(aliceAddress, 2)(alice);

      await s.consistency();
      t.deepEqual(add_contact_result.Ok.contacts.length, 1)
      t.deepEqual(add_contact_result_2.Ok.contacts.length, 2);
      t.deepEqual(invalid_add_contact_result.Err, {"Internal":"This address is already added in contacts"});
      t.deepEqual(invalid_add_contact_result_2.Err, {"Internal":"The timestamp is the same with or less than the previous timestamp"});
    })

    scenario("remove a contact", async (s, t) => {
      const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
      const aliceAddress = alice.instance("lobby").agentAddress;
      const bobAddress = bob.instance("lobby").agentAddress;

      const add_contact_alice_result = await addContacts(bobAddress, 1)(alice);
      await s.consistency();
      const add_contact_alice_result_2 = await addContacts(aliceAddress, 2)(alice);
      await s.consistency();

      const remove_contact_alice_reult = await removeContacts(bobAddress, 3)(alice);
      // no address exisiting
      const invalid_remove_1 = await removeContacts(bobAddress, 4)(alice)
      // timestamp invalid
      const invalid_remove_2 = await removeContacts(aliceAddress, 3)(alice)
      t.ok(add_contact_alice_result.Ok)
      t.ok(add_contact_alice_result_2.Ok)
      t.deepEqual(invalid_remove_1.Err, {"Internal":"This address wasn't found in the contract"})
      t.deepEqual(invalid_remove_2.Err, {"Internal":"The timestamp is the same with or less than the previous timestamp"})
      t.deepEqual(remove_contact_alice_reult.Ok.contacts.length, 1)
    })

    scenario("list contacts", async (s, t) => {
      const {alice, bob} = await s.players({alice: conductorConfig, bob: conductorConfig}, true);
      const aliceAddress = alice.instance("lobby").agentAddress;
      const bobAddress = bob.instance("lobby").agentAddress;

      const error_list_contacts = await listContacts()(alice);
      const add_contact_alice_result = await addContacts(bobAddress, 1)(alice);
      await s.consistency();
      const add_contact_alice_result_2 = await addContacts(aliceAddress, 2)(alice);
      await s.consistency();
      const list_contacts = await  listContacts()(alice);

      t.ok(add_contact_alice_result.Ok)
      t.ok(add_contact_alice_result_2.Ok)
      t.deepEqual(error_list_contacts.Err, {"Internal": "This agent has no contacts entry"})
      t.deepEqual(list_contacts.Ok.length, 2);
    })
}