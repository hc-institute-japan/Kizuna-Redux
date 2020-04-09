#![feature(proc_macro_hygiene)]
use hdk_proc_macros::zome;
use serde_derive::{Deserialize, Serialize}
use hdk::{
    entry_definition::ValidatingEntryType,
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    holochain_persistence_api::cas::content::Address
};
use crate::profile::{
    PrivateProfile,
    PrivateProfileEntry,
    PublicProfile,
    PublicProfileEntry
};
pub mod profile;

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
        profile::private_profile_definiton();
    }

    #[entry_def]
    fn public_profile_def() -> ValidatingEntryType {
        profile::handlers::public_profile_definiton()
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
    fn list_profiles() -> ZomeApiResult<Vec<PublicProfile>> {
        profile::handlers::list_profiles()
    }
    
}
