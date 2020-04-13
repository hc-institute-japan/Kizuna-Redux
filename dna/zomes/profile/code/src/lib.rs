#![feature(proc_macro_hygiene)]

use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize};
use hdk::{
    entry_definition::ValidatingEntryType,
    error::ZomeApiResult,
    holochain_persistence_api::cas::content::Address
};
use crate::profile::{
    PrivateProfile,
    PrivateProfileEntry,
    PublicProfile,
    PublicProfileEntry
};
pub mod profile;

// MAIN FILE FOR THE PROFILE ZOME
// contains calls to entry definitions and functions

// Crate              Modules
// profile __________ mod
//            |______ handlers
//            |______ validation

#[zome]
mod profile_zome {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        // this is where you can actually have some validations for agents who want to join this network.
        // Since this is a public DHT wehere anyone can join, we might not have much of validation here. Let's see.
        Ok(())
    }

    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    #[entry_def]
    fn private_profile_def() -> ValidatingEntryType {
        profile::private_profile_definition()
    }

    #[entry_def]
    fn public_profile_def() -> ValidatingEntryType {
        profile::public_profile_definition()
    }

    #[zome_fn("hc_public")]
    fn create_private_profile(input: PrivateProfileEntry) -> ZomeApiResult<PrivateProfile> {
        profile::handlers::create_private_profile(input)
    }

    #[zome_fn("hc_public")]
    fn create_public_profile(input: PublicProfileEntry) -> ZomeApiResult<PublicProfile> {
        profile::handlers::create_public_profile(input)
    }

    #[zome_fn("hc_public")]
    fn get_public_profile(id: Address) -> ZomeApiResult<PublicProfile> {
        profile::handlers::get_public_profile(id)
    }

    #[zome_fn("hc_public")]
    fn get_private_profile(id: Address) -> ZomeApiResult<PrivateProfile> {
        profile::handlers::get_private_profile(id)
    }

    #[zome_fn("hc_public")]
    fn list_public_profiles() -> ZomeApiResult<Vec<PublicProfile>> {
        profile::handlers::list_public_profiles()
    }
    
    #[zome_fn("hc_public")]
    fn search_username(input: PublicProfileEntry) -> ZomeApiResult<Vec<PublicProfile>> {
        profile::handlers::search_username(input)
    }
}
