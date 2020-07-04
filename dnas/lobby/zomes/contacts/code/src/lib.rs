#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;

pub mod contact;
use contact::{
    Profile,
    // Contacts,
};

// see https://developer.holochain.org/api/0.0.47-alpha1/hdk/ for info on using the hdk library

#[zome]
mod contacts {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    fn contacts_def() -> ValidatingEntryType {
        contact::contacts_definition()
    }

    #[zome_fn("hc_public")]
    fn add_contact(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
        contact::handlers::add(username, timestamp)
    }

    #[zome_fn("hc_public")]
    fn remove_contact(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
        contact::handlers::remove(username, timestamp)
    }

    #[zome_fn("hc_public")]
    fn list_contacts() -> ZomeApiResult<Vec<Address>> {
        contact::handlers::list_contacts()
    }

    #[zome_fn("hc_public")]
    fn block(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
        contact::handlers::block(username, timestamp)
    }

    #[zome_fn("hc_public")]
    fn unblock(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
        contact::handlers::unblock(username, timestamp)
    }

    #[zome_fn("hc_public")]
    fn list_blocked() -> ZomeApiResult<Vec<Address>> {
        contact::handlers::list_blocked()
    }

    #[zome_fn("hc_public")]
    fn in_contacts(id: Address) -> ZomeApiResult<bool> {
        contact::handlers::in_contacts(id)
    }
}
