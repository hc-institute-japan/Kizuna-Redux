use hdk::{
    error::ZomeApiResult,
    holochain_core_types::{
        entry::Entry,
    },
    holochain_persistence_api::cas::content::{
        Address,
        AddressableContent
    },
    prelude::*,
};
use holochain_anchors::anchor;
use crate::Profile::{
    PublicProfile,
    PrivateProfile,
    PublicProfileInput,
    PrivatProfileInput,
    // test strings file implementation
    PRIVATE_PROFILE_ENTRY_NAME,
    PUBLIC_PROFILE_ENTRY_NAME,
    PRIVATE_PROFILE_LINK_TYPE,
    PUBLIC_PROFILE_LINK_TYPE,
    PRIVATE_PROFILES_ANCHOR_TYPE,
    PUBLIC_PROFILES_ANCHOR_TYPE,
    PRIVATE_PROFILES_ANCHOR_TEXT,
    PUBLIC_PROFILES_ANCHOR_TEXT,
};

// helper function to attach anchors to profiles
fn anchor_profile(anchor_type: String, anchor_text: String) -> ZomeApiResult<Address> {
    anchor(anchor_type.to_string(), anchor_text.to_string())
}
pub fn create_private_profile(input: PrivateProfileInput) -> ZomeApiResult<PrivateProfile> {
    let new_private_profile_entry = Entry::App(PRIVATE_PROFILE_ENTRY_NAME.into(), input.clone().into());
    let address = hdk::commit_entry(&new_private_profile_entry)?;
    hdk::link_entries(&anchor_profile(PRIVATE_PROFILES_ANCHOR_TYPE, PRIVATE_PROFILES_ANCHOR_TEXT)?, &address, PRIVATE_PROFILE_LINK_TYPE, "")?;
    PrivateProfile::new(address, input)
}
pub fn create_public_profile(input: PublicProfileInput) -> ZomeApiResult<PublicProfile> {
    let new_public_profile_entry = Entry::App(PUBLIC_PROFILE_ENTRY_NAME.into(), input.clone().into());
    let address = hdk::commit_entry(&new_public_profile_entry)?;
    hdk::link_entries(&anchor_profile(PUBLIC_PROFILES_ANCHOR_TYPE, PUBLIC_PROFILES_ANCHOR_TEXT)?, &address, PUBLIC_PROFILE_LINK_TYPE, "")?;
    PublicProfile::new(address, input)
}
pub fn get_private_profile(id: Address) -> ZomeApiResult<Profile> {
    let entry: PrivateProfileEntry = hdk::utils::get_as_type(id.clone())?; //returns type result
    PrivateProfile::new(id, entry)
}
pub fn get_public_profile(id: Address) -> ZomeApiResult<Profile> {
    let entry: PublicProfileEntry = hdk::utils::get_as_type(id.clone())?; //returns type result
    PublicProfile::new(id, entry)
}
fn list_profiles() -> ZomeApiResult<Vec<PublicProfile>> {
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