#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;

pub mod contact;
use contact::{
    Contacts,
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
    fn add_contact(contact_address: Address, timestamp: usize) -> ZomeApiResult<Contacts> {
        contact::handlers::add(contact_address, timestamp)
    }

    #[zome_fn("hc_public")]
    fn remove_contact(contact_address: Address, timestamp: usize) -> ZomeApiResult<Contacts> {
        contact::handlers::remove(contact_address, timestamp)
    }

    #[zome_fn("hc_public")]
    fn list_contacts() -> ZomeApiResult<Vec<Address>> {
            contact::handlers::list_contacts()
    }

    #[zome_fn("hc_public")]
    fn list_address() -> ZomeApiResult<Vec<Address>> {
            contact::handlers::list_address()
    }

    // #[zome_fn("hc_public")]
    // fn block_contacts() -> ZomeApiResult<()> {
    // }

    // #[zome_fn("hc_public")]
    // fn remove_blocked_contacts() -> ZomeApiResult<()> {
    // }
}
