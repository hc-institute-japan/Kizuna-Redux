use hdk::{
    api::AGENT_ADDRESS,
    prelude::*,
};
use super::{
    strings::*,
    Contacts,
    HolochainEntry,
};

pub fn create(timestamp: usize) -> ZomeApiResult<Address> {
    let new_contacts_entry = Contacts::new(timestamp).entry();
    let contacts_address = hdk::commit_entry(&new_contacts_entry)?;
    hdk::link_entries(
        &AGENT_ADDRESS,
        &contacts_address,
        AGENT_CONTACTS_LINK_TYPE,
        "contacts"
    )?;
    Ok(contacts_address);
}

pub fn update(contact_address: Address, timestamp: usize) -> ZomeApiResult<Address> {

}

pub fn get_my_entry(address: Address) -> ZomeApiResult<Option<Entry>> {
    hdk::get_entry(&address)
}