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

const PROFILE_ENTRY_NAME: &str = "profile";
const PROFILE_LINK_TYPE: &str = "profile_link";
const PROFILES_ANCHOR_TYPE: &str = "profiles";
const PROFILES_ANCHOR_TEXT: &str = "profiles";

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct Profile {
    id: Address,
    first_name: String,
    last_name: String,
    email: String,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
#[serde(rename_all = "snake_case")]
pub struct ProfileEntry {
    first_name: String,
    last_name: String,
    email: String,
}

impl Profile {
    pub fn new(id: Address, profile_input: ProfileEntry) ->  ZomeApiResult<Profile> {
        Ok(Profile {
            id: id.clone(),
            first_name: profile_input.first_name,
            last_name: profile_input.last_name,
            email: profile_input.email
        })
    }

    // pub fn entry(profile_input: ProfileEntry) -> ZomeApiResult<Entry> {
    //     Entry::App(PROFILE_ENTRY_NAME.into(), profile_input.clone().into())
    // }

    // pub fn profile_from_entry(entry_input: Entry) -> ZomeApiResult<Profile> {
    //     Ok(Profile {
    //         id: Entry.address.clone(),
    //         first_name: entry_input.first_name,
    //         second_name: entry_input.last_name,
    //         email: entry_input.email
    //     })
    // }
}

#[zome]
mod profile_zome {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    fn definition() -> ValidatingEntryType {
        entry!(
            name: PROFILE_ENTRY_NAME,
            description: "this is the profile spec of the user",
            sharing: Sharing::Public,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::EntryValidationData<ProfileEntry>| {
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
    fn create_profile(profile_input: ProfileEntry) -> ZomeApiResult<Profile> {
        // let new_profile_entry = Profile::entry(profile_input);
        let new_profile_entry = Entry::App(PROFILE_ENTRY_NAME.into(), profile_input.clone().into());
        let address = hdk::commit_entry(&new_profile_entry)?;
        hdk::link_entries(&profiles_anchor()?, &address, PROFILE_LINK_TYPE, "")?;
        Profile::new(address, profile_input)
    }

    // #[zome_fn("hc_public")]
    pub fn get_profile(id: Address) -> ZomeApiResult<Profile> {
        let entry: ProfileEntry = hdk::utils::get_as_type(id.clone())?; //returns type result
        Profile::new(id, entry)
    }
    
    #[zome_fn("hc_public")]
    fn list_profiles() -> ZomeApiResult<Vec<Profile>> {
        hdk::get_links_and_load(&profiles_anchor()?, LinkMatch::Exactly(PROFILE_LINK_TYPE), LinkMatch::Any)
            .map(|profile_list|{
                profile_list.into_iter()
                    .filter_map(Result::ok)
                    .flat_map(|entry| {
                        let id = entry.address();
                        hdk::debug(format!("list_entry{:?}", entry)).ok();
                        get_profile(id)
                    }).collect()
            })
    }
}
