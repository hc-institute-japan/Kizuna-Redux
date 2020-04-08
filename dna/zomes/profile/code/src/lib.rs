#![feature(proc_macro_hygiene)]
// #[allow(dead_code)]

// use hdk::prelude::*'
use hdk_proc_macros::zome;
use holochain_anchors::anchor;
use hdk::{
    self,
    entry,
    from,
    link,
    entry_definition::ValidatingEntryType,
    holochain_core_types::{
        dna::entry_types::Sharing,
    },
    holochain_json_api::{
        json::JsonString,
        error::JsonError,
    },
    prelude::*,
    holochain_persistence_api::cas::content::Address
};

// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

// To avoid typo
const PRIVATE_PROFILE_ENTRY_NAME: &str = "PRIVATE_PROFILE";
const PUBLIC_PROFILE_ENTRY_NAME: &str = "PUBLIC_PROFILE";

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
// this entry is the privateprofile which wil not be propagated to the DHT
pub struct PrivateProfile {
    first_name: String,
    last_name: String,
    email: String,
}

impl PrivateProfile {
    // implement a new() function for PrivateProfile that will generate a new
    // struct for with the given arguments
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

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
// a public profile that can be looked up by anyone
pub struct PublicProfile {
    username: String,
}

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
    fn private_profile_definition() -> ValidatingEntryType {
        entry!(
            name: PRIVATE_PROFILE_ENTRY_NAME, // uses the variable to avoid typo
            description: "this is the private profile spec of the user",
            sharing: Sharing::Public, // currently public but has to be private when released
            validation_package: || {
                // this is the validation package that an agent can use to validate this entry.
                // For now it is just using the Entry itself to validate it but there are more options
                // such as the entire source chain of the agent or al the entries
                // more here: https://docs.rs/hdk/0.0.46-alpha1/hdk/prelude/enum.ValidationPackageDefinition.html
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<PrivateProfile>| {
                // this is the actual callback that will be called by the agent when they are going to validate this entry.
                // Since this is a private entry (eventually) only the creator of thie entry can validate it.
                // For now, it is just Ok(()) which does not anything.
                Ok(())
            }
        )
    }

    #[entry_def]
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
                    link_type: PROFILE_LINK_TYPE,
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

    #[entry_def]
    fn anchor_def() ->ValidatingEntryType {
        holochain_anchors::anchor_definition()
    }

    fn profiles_anchor() -> ZomeApiResult<Address> {
        anchor(PROFILES_ANCHOR_TYPE.to_string(), PROFILES_ANCHOR_TEXT.to_string())
    }

    #[zome_fn("hc_public")]
    fn create_private_profile(first_name: String, last_name: String, email: String) -> ZomeApiResult<Address> {
        let new_private_profile = PrivateProfile::new(first_name, last_name, email);
        let new_private_profile_entry = new_private_profile.entry();
        let address = hdk::commit_entry(&new_private_profile_entry)?;
        Ok(address)
    }

    // #[zome_fn("hc_public")]
    pub fn get_profile(id: Address) -> ZomeApiResult<Profile> {
        let entry: ProfileEntry = hdk::utils::get_as_type(id.clone())?; //returns type result
        Profile::new(id, entry)
    }
    
    #[zome_fn("hc_public")]
    fn create_public_profile(username: String,) -> ZomeApiResult<Address> {
        let new_public_profile = PublicProfile::new(username);
        let new_public_profile_entry = new_public_profile.entry();
        let address = hdk::commit_entry(&new_public_profile_entry)?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_profile(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }
}
