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
use crate::profile::{
    PublicProfile,
    PrivateProfile,
    PublicProfileEntry,
    PrivateProfileEntry,
    PRIVATE_PROFILE_ENTRY_NAME,
    PUBLIC_PROFILE_ENTRY_NAME,
    PRIVATE_PROFILE_LINK_TYPE,
    PUBLIC_PROFILE_LINK_TYPE,
    PRIVATE_PROFILES_ANCHOR_TYPE,
    PUBLIC_PROFILES_ANCHOR_TYPE,
    PRIVATE_PROFILES_ANCHOR_TEXT,
    PUBLIC_PROFILES_ANCHOR_TEXT,
};

// HANDLER MODULE UNDER THE PROFILE CRATE
// contains function implementations; 
//      anchor_profile()
//      create_private_profile()
//      create_public_profile()
//      get_private_profile()
//      get_public_profile()
//      list_public_profiles()
//      search_public_profile()


// anchor_profile()
// attach anchors to newly created profiles
// anchor format: 
//      anchor type: 'PRIVATE_PROFILE_<first character of username>' or 'PUBLIC_PROFILE_<first character of username>'
//      anchor text: 'PRIVATE_PROFILES_<first character of username>' or 'PUBLIC_PROFILES_<first character of username>'
fn anchor_profile(anchor_type: String, anchor_text: String, username: String) -> ZomeApiResult<Address> {
    let first_letter = username.chars().next().unwrap();
    let type_string = format!("{}{}{}", anchor_type, "_", first_letter);
    let text_string = format!("{}{}{}", anchor_text, "_", first_letter);
    anchor(type_string.to_string(), text_string.to_string())
}
fn anchor_profile_2(anchor_type: String, anchor_text: String) -> ZomeApiResult<Address> {
    anchor(anchor_type.to_string(), anchor_text.to_string())
}

// create_private_profile(), create_public_profile()
// argument(s): PrivateProfileEntry, PublicProfileEntry
// return value: PrivateProfile, PublicProfile
pub fn create_private_profile(input: PrivateProfileEntry) -> ZomeApiResult<PrivateProfile> {
    // creates an entry that will be committed
    let new_private_profile_entry = Entry::App(PRIVATE_PROFILE_ENTRY_NAME.into(), input.clone().into());
    // commits the entry to the DHT and gets the address of the committed entry
    let address = hdk::commit_entry(&new_private_profile_entry)?;
    // links the entry using the specified anchors and tags
    hdk::link_entries(
        &anchor_profile_2(
            PRIVATE_PROFILES_ANCHOR_TYPE.to_string(), // PRIVATE_PROFILE
            PRIVATE_PROFILES_ANCHOR_TEXT.to_string(), // PRIVATE_PROFILES
        )?, 
        &address,                                     // address of entry in the dht
        PRIVATE_PROFILE_LINK_TYPE,                    // PRIVATE_PROFILE_LINK
        ""                                            // tag: <any string>
    )?;
    PrivateProfile::new(address, input)
}
pub fn create_public_profile(input: PublicProfileEntry) -> ZomeApiResult<PublicProfile> {
    let new_public_profile_entry = Entry::App(PUBLIC_PROFILE_ENTRY_NAME.into(), input.clone().into());
    let address = hdk::commit_entry(&new_public_profile_entry)?;
    hdk::link_entries(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(),    // PUBLIC_PROFILE
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),    // PUBLIC_PROFILES
            input.clone().username                      // <username input> to concatenate to anchor type and text
        )?, 
        &address,                                       // address of the entry in the dht
        PUBLIC_PROFILE_LINK_TYPE,                       // PUBLIC_PROFILE_LINK
        &input.username                                 // tag: username (for easier searching)
    )?;
    PublicProfile::new(address, input)
}

// get_private_profile(), get_public_profile()
// argument(s): Address
// return value: PrivateProfile or PublicProfile
pub fn get_private_profile(id: Address) -> ZomeApiResult<PrivateProfile> {
    // get the entry at the given address and convert to the given type (i.e. PrivateProfileEntry)
    let entry: PrivateProfileEntry = hdk::utils::get_as_type(id.clone())?;
    // create a new PrivateProfile structure and populate the details from the entry
    PrivateProfile::new(id, entry)
}
pub fn get_public_profile(id: Address) -> ZomeApiResult<PublicProfile> {
    let entry: PublicProfileEntry = hdk::utils::get_as_type(id.clone())?;
    PublicProfile::new(id, entry)
}

// list_public_profiles()
// argument(s): none (can be changed to username)
// return value: Vector of PublicProfile
pub fn list_public_profiles() -> ZomeApiResult<Vec<PublicProfile>> {
    // get the entries from the DHT with the specified anchors, link type, and tag
    // outputs a ZomeApiResult<Vec<ZomeApiResult<Entry>>>
    hdk::get_links_and_load(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(),        // anchor_type: PUBLIC_PROFILE_n
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),        // anchor_text: PUBLIC_PROFILES_n
            "n".to_string()                                 // stub for testing; concatenated to anchor type and text
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE),       // link_type: PUBLIC_PROFILE_LINK
        LinkMatch::Exactly("nicko")                         // tag: nicko
    // iterate over the Vec<ZomeApiResult<Entry>> result
    ).map(|profile_list| {
        // apply eerything below to every profile_list
        // converts profile_list to an iterator
        profile_list.into_iter()
            // return only values of result type ok
            .filter_map(Result::ok)
            // flatten nested structure
            .flat_map(|entry| {
                // apply everything below to every entry
                let id = entry.address();
                hdk::debug(format!("list_entry{:?}", entry)).ok();
                get_public_profile(id)
            }
        // convert the iterator back into a collection after modification
        ).collect()
    })
}

// search_username()
// argument(s): PublicProfileEntry
// return value: Vector of PublicProfile
pub fn search_username(input: PublicProfileEntry) -> ZomeApiResult<Vec<PublicProfile>> {
    hdk::get_links_and_load(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(), 
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),
            input.username.clone()
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE), 
        LinkMatch::Exactly(&input.username)                  // matches the username exactly to return only one
    ).map(|profile_list|{
        profile_list.into_iter()
            .filter_map(Result::ok)
            .flat_map(|entry| {
                let id = entry.address();
                get_public_profile(id)
            }
        ).collect()
    })
}