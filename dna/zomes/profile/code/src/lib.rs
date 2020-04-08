#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;

// see https://developer.holochain.org/api/0.0.42-alpha5/hdk/ for info on using the hdk library

const PROFILE_ENTRY_NAME: &str = "profile";

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Profile {
    first_name: String,
    last_name: String,
    email: String,
}

impl Profile {
    pub fn new(first_name: String, last_name: String, email: String) -> Self {
        Profile {
            first_name,
            last_name,
            email,
        }
    }

    pub fn entry(&self) -> Entry {
        Entry::App(PROFILE_ENTRY_NAME.into(), self.into())
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
            validation: | _validation_data: hdk::EntryValidationData<Profile>| {
                Ok(())
            }
        )
    }

    #[zome_fn("hc_public")]
    fn create_profile(first_name: String, last_name: String, email: String) -> ZomeApiResult<Address> {
        let new_profile = Profile::new(first_name, last_name, email);
        let new_profile_entry = new_profile.entry();
        let address = hdk::commit_entry(&new_profile_entry)?;
        Ok(address)
    }

    #[zome_fn("hc_public")]
    fn get_profile(address: Address) -> ZomeApiResult<Option<Entry>> {
        hdk::get_entry(&address)
    }
}
