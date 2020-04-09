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
        time::Timeout,
        time::Iso8601,
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

// CONSTANT STRINGS (to avoid typo)
// Entry Names
const PRIVATE_PROFILE_ENTRY_NAME: &str = "PRIVATE_PROFILE";
const PUBLIC_PROFILE_ENTRY_NAME: &str = "PUBLIC_PROFILE";
// Link Types 
const PRIVATE_PROFILE_LINK_TYPE: &str = "PRIVATE_PROFILE_LINK";
const PUBLIC_PROFILE_LINK_TYPE: &str = "PUBLIC_PROFILE_LINK";
// Anchor Types
const PRIVATE_PROFILES_ANCHOR_TYPE: &str = "PRIVATE_PROFILE";
const PUBLIC_PROFILES_ANCHOR_TYPE: &str = "PUBLIC_PROFILE";
// Anchor Text
const PRIVATE_PROFILES_ANCHOR_TEXT: &str = "PRIVATE_PROFILES";
const PUBLIC_PROFILES_ANCHOR_TEXT: &str = "PUBLIC_PROFILES";

// STRUCTS
// Private Profile; this entry is the private profile which wil not be propagated to the DHT
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct PrivateProfile {
    id: Address,
    first_name: String,
    last_name: String,
    email: String,
}
// Public Profile; a public profile that can be looked up by anyone
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct PublicProfile {
    id: Address,
    username: String,
}
// Private Profile Entry
#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
pub struct PrivateProfileInput {
    first_name: String,
    last_name: String,
    email: String,
}
// Public Profile Entry
#[derive(Serialize, Deserialize, Debug, DefaultJson,Clone)]
pub struct PublicProfileInput {
    username: String,
}

// IMPLEMENTATIONS OF STRUCTS
// Private Profile; new(), entry()
impl PrivateProfile {
    // a new() function that will generate a new struct for with the given arguments
    pub fn new(first_name: String, last_name: String, email: String) -> Self {
        PrivateProfile {
            first_name,
            last_name,
            email,
        }
    }
    // turns a PrivateProfile struct into an entry for sourcechain and DHT
    pub fn entry(&self) -> Entry {
        Entry::App(PRIVATE_PROFILE_ENTRY_NAME.into(), self.into())
    }
}
// Public Profile; new(), entry()
impl PublicProfile {
    pub fn new(username: String) -> Self {
        PublicProfile {
            username,
        }
    }

    pub fn entry(&self) -> Entry {
        Entry::App(PUBLIC_PROFILE_ENTRY_NAME.into(), self.into())
    }
}

// DEFINITIONS
// Private Profile
fn private_profile_definition() -> ValidatingEntryType {
    entry!(
        name: PRIVATE_PROFILE_ENTRY_NAME, // uses the variable to avoid typo
        description: "this is the private profile spec of the user",
        sharing: Sharing::Public, // currently public but has to be private when released
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PrivateProfile>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: PUBLIC_PROFILE_LINK_TYPE,
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: |validation_data: hdk::LinkValidationData| {
                    Ok(())
                }
            )
        ]
    )
}
// Public Profile
fn public_profile_definition() -> ValidatingEntryType {
    entry!(
        name: PUBLIC_PROFILE_ENTRY_NAME,
        description: "this is the public profile spec of the user",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<PublicProfile>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: PRIVATE_PROFILE_LINK_TYPE,
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
// Anchor
fn anchor_def() ->ValidatingEntryType {
    holochain_anchors::anchor_definition()
}

// HELPER FUNCTION
// Timestamp: populates timestamp values in structs when in use
fn timestamp(address: Address) -> ZomeApiResult<Iso8601> {
    let options = GetEntryOptions{status_request: StatusRequestKind::Initial, entry: false, headers: true, timeout: Timeout::new(10000)};
    let entry_result = hdk::get_entry_result(&address, options)?;
    match entry_result.result {
        GetEntryResultType::Single(entry) => {
            Ok(entry.headers[0].timestamp().clone())
        },
        _ => {
            unreachable!()
        }
    }
}