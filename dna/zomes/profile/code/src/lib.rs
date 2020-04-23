#![feature(proc_macro_hygiene)]
#![allow(dead_code)]
#![allow(unused_imports)]

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
    PublicProfileEntry,
    HashedEmail,
    BooleanReturn
};
pub mod profile;

// MAIN FILE FOR THE PROFILE ZOME
// contains calls to entry definitions and functions

// Crate              Modules
// profile __________ mod
//            |______ handlers
//            |______ validation
//            |______ strings

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

    // ENTRY DEFINITIONS
    #[entry_def]
    fn private_profile_def() -> ValidatingEntryType {
        profile::private_profile_definition()
    }
    
    #[entry_def]
    fn public_profile_def() -> ValidatingEntryType {
        profile::public_profile_definition()
    }
    
    #[entry_def]
    fn hashed_email_def() -> ValidatingEntryType {
        profile::hashed_email_definition()
    }
    
    #[entry_def]
    fn anchor_def() -> ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }


    // FRONTEND FUNCTIONS
    #[zome_fn("hc_public")]
    fn is_email_registered (email: String) -> ZomeApiResult<BooleanReturn> {
        let result = profile::handlers::check_email(email)?;
        Ok(BooleanReturn {value: result})
    }

    #[zome_fn("hc_public")]
    fn is_username_registered (username: String) -> ZomeApiResult<BooleanReturn> {
        let result = profile::handlers::check_username(username)?;
        Ok(BooleanReturn {value: result})
    }

    // #[zome_fn("hc_public")]
    // fn register(
    //     public_input: PublicProfileEntry, 
    //     private_input: PrivateProfileEntry
    //     ) -> ZomeApiResult<PublicProfile> {
    //         profile::handlers::create_private_profile(private_input.clone())?;
    //         profile::handlers::create_hashed_email(private_input)?;
    //         profile::handlers::create_public_profile(public_input)
    // }

    #[zome_fn("hc_public")]
    fn create_private_profile(input: PrivateProfileEntry) -> ZomeApiResult<PrivateProfile> {
        profile::handlers::create_private_profile(input.clone())
    }
    
    #[zome_fn("hc_public")]
    fn create_public_profile(input: PublicProfileEntry) -> ZomeApiResult<PublicProfile> {
        profile::handlers::create_public_profile(input)
    }
    
    // #[zome_fn("hc_public")]
    // fn get_agent_id() -> ZomeApiResult<Address> {
    //     Ok(hdk::AGENT_ADDRESS.clone())
    // }
}