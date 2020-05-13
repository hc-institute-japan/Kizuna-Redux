use hdk::{
    api::AGENT_ADDRESS,
    prelude::*,
};
use super::{
    strings::*,
    Contacts,
    ContactsAnchor,
    HolochainEntry,
};

pub fn add_contact(agent_address: Address, timestamp: usize) -> ZomeApiResult<Address> {
    let link_result = hdk::get_links(AGENT_ADDRESS, AGENT_CONTACTS_ANCHOR_LINK_TYPE, "contacts")?;
    match link_result.links().len() {
        0 => {
            let anchor_entry = ContactsAnchor::new(timestamp).entry();
            let anchor_address = hdk::commit_entry(&anchor_entry)?;

            let mut new_contacts = Contacts::new(anchor_address.clone());
            // TODO: call a get_username from profile zome to check if this address has a username
            new_contacts.contacts.push(agent_address);
            let contacts_entry = new_contacts.entry();
            let contacts_address = hdk::commit_entry(contacts_entry)?;

            hdk::link_entries(
                &AGENT_ADDRESS,
                &anchor_address,
                AGENT_CONTACTS_ANCHOR_LINK_TYPE,
                "contacts"
            )?;
            hdk::link_entries(
                &anchor_address,
                &contacts_address,
                ANCHOR_CONTACTS_LINK_TYPE,
                "0"
            )?;
            
        },
        1 => {
            let anchor_address = link_result.links()[0].address;
        },
        _ => {},
    }
}

pub fn get_my_entry(address: Address) -> ZomeApiResult<Option<Entry>> {
    hdk::get_entry(&address)
}