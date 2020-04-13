use serde_derive::{Deserialize, Serialize};
use holochain_json_derive::DefaultJson;
use hdk::{
    self,
    entry,
    from,
    link,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
        // time::Timeout,
        // time::Iso8601,
    },
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    prelude::*,
    holochain_persistence_api::cas::content::Address
};

pub mod handlers;
pub mod validation;
pub mod strings;
use strings::{
    PRIVATE_PROFILE_LINK_TYPE,
    PRIVATE_PROFILE_ENTRY_NAME,
    PUBLIC_PROFILE_LINK_TYPE,
    PUBLIC_PROFILE_ENTRY_NAME,
};

// MAIN MODULE UNDER THE PROFILE CRATE
// contains data structure definitions and implementations, and entry definitions

// STRUCTS
// Private Profile; this entry is the private profile which wil not be propagated to the DHT
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PrivateProfile {
    id: Address,
    first_name: String,
    last_name: String,
    email: String,
}
// Public Profile; a public profile that can be looked up by anyone
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PublicProfile {
    id: Address,
    username: String,
}
// Private Profile Entry
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PrivateProfileEntry {
    first_name: String,
    last_name: String,
    email: String,
}
// Public Profile Entry
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PublicProfileEntry {
    username: String,
}

// IMPLEMENTATIONS OF STRUCTS
// Private Profile; new()
impl PrivateProfile {
    // a new() function that will generate a new private profile struct with the given arguments
    pub fn new(id: Address, profile_input: PrivateProfileEntry) -> ZomeApiResult<PrivateProfile> {
        Ok(PrivateProfile {
            id: id.clone(),
            first_name: profile_input.first_name,
            last_name: profile_input.last_name,
            email: profile_input.email
        })
    }
}
// Public Profile; new()
impl PublicProfile {
    // a new() function that will generate a new public profile struct with the given arguments
    pub fn new(id: Address, input: PublicProfileEntry) -> ZomeApiResult<PublicProfile> {
        Ok(PublicProfile {
            id: id.clone(),
            username: input.username
        })
    }
}

// DEFINITIONS
// Private Profile
pub fn private_profile_definition() -> ValidatingEntryType {
    entry!(
        name: PRIVATE_PROFILE_ENTRY_NAME, // uses the variable to avoid typo
        description: "this is the private profile spec of the user",
        sharing: Sharing::Public, // currently public but has to be private when released
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PrivateProfileEntry>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: PRIVATE_PROFILE_LINK_TYPE,
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: | _validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            )
        ]
    )
}
// Public Profile
pub fn public_profile_definition() -> ValidatingEntryType {
    entry!(
        name: PUBLIC_PROFILE_ENTRY_NAME,
        description: "this is the public profile spec of the user",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PublicProfileEntry>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: PUBLIC_PROFILE_LINK_TYPE,
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: | _validation_data: hdk::LinkValidationData | {
                    Ok(())
                }
            )
        ]
    )
}

// HELPER FUNCTION
// Timestamp: populates timestamp values in structs when in use
// fn timestamp(address: Address) -> ZomeApiResult<Iso8601> {
//     let options = GetEntryOptions{status_request: StatusRequestKind::Initial, entry: false, headers: true, timeout: Timeout::new(10000)};
//     let entry_result = hdk::get_entry_result(&address, options)?;
//     match entry_result.result {
//         GetEntryResultType::Single(entry) => {
//             Ok(entry.headers[0].timestamp().clone())
//         },
//         _ => {
//             unreachable!()
//         }
//     }
// }