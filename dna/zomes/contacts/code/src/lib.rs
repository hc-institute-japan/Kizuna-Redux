#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;

pub mod contacts;

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
        contacts::contacts_definition()
    }

    #[entry_def]
    fn contacts_anchor_def() -> ValidatingEntryType {
        contacts::contacts_anchor_definition()
    }

    #[zome_fn("hc_public")]
    fn crate_contacts() -> ZomeApiResult<()> {

    }

    #[zome_fn("hc_public")]
    fn add_contacts() -> ZomeApiResult<()> {
    }

    #[zome_fn("hc_public")]
    fn remove_contacts() -> ZomeApiResult<()> {
    }

    #[zome_fn("hc_public")]
    fn list_contacts() -> ZomeApiResult<()> {
    }

    #[zome_fn("hc_public")]
    fn block_contacts() -> ZomeApiResult<()> {
    }

    #[zome_fn("hc_public")]
    fn remove_blocked_contacts() -> ZomeApiResult<()> {
    }
}
