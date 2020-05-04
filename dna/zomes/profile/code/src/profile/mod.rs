#![allow(dead_code)]
#![allow(unused_imports)]

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
    api::AGENT_ADDRESS,
    prelude::*,
    holochain_persistence_api::cas::content::Address
};
use std::collections::{
    hash_map::DefaultHasher,
    HashMap
};
use std::hash::{
    Hash, 
    Hasher
};

pub mod handlers;
pub mod validation;
pub mod strings;
use strings::*;
// MAIN MODULE UNDER THE PROFILE CRATE
// contains data structure definitions and implementations, and entry definitions

// STRUCTS
// Private Profile; this entry is the private profile which wil not be propagated to the DHT
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PrivateProfile {
    pub id: Address,
    first_name: String,
    last_name: String,
    email: String,
}
// Public Profile; a public profile that can be looked up by anyone
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct PublicProfile {
    id: Address,
    agent_id: Address,
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
// Hashed Email
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct HashedEmail {
    id: Address,
    email_hash: u64,
}
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct HashedEmailEntry {
    email_hash: u64,
}
// Email table
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct EmailString {
    email: String,
}
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct BooleanReturn {
    pub value: bool,
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
            agent_id: AGENT_ADDRESS.to_string().into(),
            username: input.username
        })
    }
}

impl HashedEmail {
    pub fn new(id: Address, email_hash: u64) -> ZomeApiResult<HashedEmail> {
        Ok(HashedEmail {
            id: id.clone(),
            email_hash: email_hash
        })
    }
    pub fn from(email_hash: u64) -> HashedEmailEntry {
        HashedEmailEntry {
            email_hash: email_hash,
        }
    }
}

impl Hash for PrivateProfileEntry {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.email.hash(state);
    }
}

impl Hash for EmailString {
    fn hash<H: Hasher>(&self, state: &mut H) {
        self.email.hash(state);
    }
}

// PROFILEENTRY TRAIT
pub trait ProfileEntry {
    fn entry(self) -> Entry;
}

// Private Profile Entry
impl ProfileEntry for PublicProfileEntry {
    fn entry(self) -> Entry {
        Entry::App(PUBLIC_PROFILE_ENTRY_NAME.into(), self.into())
    }
}
// Public Profile Entry
impl ProfileEntry for PrivateProfileEntry {
    fn entry(self) -> Entry {
        Entry::App(PRIVATE_PROFILE_ENTRY_NAME.into(), self.into())
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
        validation: | validation_data: hdk::EntryValidationData<PrivateProfileEntry>| {
            match validation_data {
                hdk::EntryValidationData::Create{entry, validation_data} => {
                    if !validation_data.sources().contains(&AGENT_ADDRESS) {
                        return Err("Other agents cannot create a profile for another agent".to_string());
                    }
                    validation::validate_private_profile_create(entry, validation_data)
                },
                _ => Ok(())
            }
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
            ),
            from!(
                "%agent_id",
                link_type: AGENT_PRIVATE_LINK_TYPE,
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
// Public Profile
pub fn public_profile_definition() -> ValidatingEntryType {
    entry!(
        name: PUBLIC_PROFILE_ENTRY_NAME,
        description: "this is the public profile spec of the user",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | validation_data: hdk::EntryValidationData<PublicProfileEntry>| {
            match validation_data {
                hdk::EntryValidationData::Create{entry, validation_data} => {
                    if !validation_data.sources().contains(&AGENT_ADDRESS) {
                        return Err("Other agents cannot create a profile for another agent".to_string());
                    }
                    validation::validate_public_profile_create(entry, validation_data)
                },
                _ => Ok(())
            }
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
            ),
            from!(
                "%agent_id",
                link_type: AGENT_PUBLIC_LINK_TYPE,
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

pub fn hashed_email_definition() -> ValidatingEntryType {
    entry!(
        name: HASHED_EMAIL_ENTRY_NAME,
        description: "this is a hash of a registered email",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<HashedEmailEntry>| {
            Ok(())
        },
        links: [
            from!(
                holochain_anchors::ANCHOR_TYPE,
                link_type: HASHED_EMAIL_LINK_TYPE,
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