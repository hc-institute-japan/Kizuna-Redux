#![allow(dead_code)]
#![allow(unused_imports)]

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
    AGENT_ADDRESS
};
use holochain_anchors::anchor;
use crate::profile::{
    PublicProfile,
    PrivateProfile,
    PublicProfileEntry,
    PrivateProfileEntry,
    HashedEmailEntry,
    HashedEmail
};
use crate::profile::strings::*;
use std::collections::hash_map::DefaultHasher;
use std::hash::{
    Hash, 
    Hasher
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
    hdk::link_entries(
        &AGENT_ADDRESS,                                 // base
        &address,                                       // target
        AGENT_PRIVATE_LINK_TYPE,                              // link_type
        "private_profile"                               // tag
    )?;

    // create hashed email entry
    // let new_hashed_email_entry = Entry::App(HASHED_EMAIL_NAME.into(), &input.email,into());
    // hdk::commit_entry(&new_hashed_email_entry);
    // hdk::link_entries()

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
    hdk::link_entries(
        &AGENT_ADDRESS,                                 // base
        &address,                                       // target
        AGENT_PUBLIC_LINK_TYPE,                              // link_type
        "public_profile"                                // tag
    )?;
    PublicProfile::new(address, input)
}

// get_private_profile(), get_public_profile()
// argument(s): Address
// return value: PrivateProfile or PublicProfile
// can maybe refactored to have one function that gets the profile
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
pub fn get_hashed_email(id: Address) -> ZomeApiResult<HashedEmail> {
    let entry: HashedEmailEntry = hdk::utils::get_as_type(id.clone())?;
    HashedEmail::new(id, entry.email_hash)
    // Ok(entry)
}

// list_public_profiles()
// argument(s): none (can be changed to username)
// return value: Vector of PublicProfile
pub fn list_public_profiles(initial: String) -> ZomeApiResult<Vec<PublicProfile>> {
    // get the entries from the DHT with the specified anchors, link type, and tag
    // outputs a ZomeApiResult<Vec<ZomeApiResult<Entry>>>
    hdk::get_links_and_load(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(),        // anchor_type: PUBLIC_PROFILE_n
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),        // anchor_text: PUBLIC_PROFILES_n
            initial.to_string()                                 // stub for testing; concatenated to anchor type and text
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE),       // link_type: PUBLIC_PROFILE_LINK
        LinkMatch::Any                                      // tag: nicko
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
pub fn search_username(username: String) -> ZomeApiResult<Option<PublicProfile>> {
    hdk::get_links_and_load(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(), 
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),
            username.clone()
            // "nicko".to_string()
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE), 
        LinkMatch::Exactly(&username)                  // matches the username exactly to return only one
        // LinkMatch::Exactly(&"nicko".to_string())
    ).map(|profile_list|{
        profile_list.into_iter()
            .filter_map(Result::ok)
            .flat_map(|entry| {
                let id = entry.address();
                get_public_profile(id)
            }
        ).next()
    })
}

pub fn get_linked_profile(username: String) -> ZomeApiResult<Option<PrivateProfile>> {
    let _public_profile = search_username(username)?;
    hdk::get_links(
        &AGENT_ADDRESS, 
        LinkMatch::Exactly(AGENT_PRIVATE_LINK_TYPE), 
        LinkMatch::Exactly("private_profile")
    ).map(|result|{                     // elements are of type get_links::GetLinksResult
        result.links().into_iter()
            .flat_map(|linksresult|{
                get_private_profile(linksresult.address)
        }).next()
    })
}

pub fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}

pub fn create_hashed_email(input: PrivateProfileEntry) -> ZomeApiResult<HashedEmail> {
    let email_hash = calculate_hash(&input);
    let new_hashed_email_entry = Entry::App(HASHED_EMAIL_ENTRY_NAME.into(), HashedEmail::from(email_hash).into());
    let address = hdk::commit_entry(&new_hashed_email_entry)?;
    hdk::link_entries(
        &anchor_profile(
            HASHED_EMAIL_ANCHOR_TYPE.to_string(),        
            HASHED_EMAIL_ANCHOR_TEXT.to_string(),        
            email_hash.clone().to_string()            
        )?, 
        &address,                                       
        HASHED_EMAIL_LINK_TYPE,                         
        &email_hash.to_string()                        
    )?;
    HashedEmail::new(address, email_hash)
}

pub fn get_hashed_emails (_email: String) -> ZomeApiResult<Vec<HashedEmail>> {
    hdk::get_links(
        &anchor_profile_2(
            HASHED_EMAIL_ANCHOR_TYPE.to_string(),
            HASHED_EMAIL_ANCHOR_TEXT.to_string(),
        )?,
        LinkMatch::Exactly(HASHED_EMAIL_ANCHOR_TYPE),
        LinkMatch::Any
    )?.addresses().into_iter().map(|entry_address| {
        get_hashed_email(entry_address)
    }).collect()
}

pub fn compare_hashes (input: PrivateProfileEntry) -> ZomeApiResult<HashedEmail>{
    let input_email_hash = calculate_hash(&input);
    let matches = hdk::get_links(
        &anchor_profile(
            HASHED_EMAIL_ANCHOR_TYPE.to_string(),
            HASHED_EMAIL_ANCHOR_TEXT.to_string(),
            input_email_hash.to_string()
        )?,
        LinkMatch::Exactly(HASHED_EMAIL_LINK_TYPE),
        LinkMatch::Any
    )?.addresses().into_iter().take_while(|entry_address|     
        get_hashed_email(entry_address.clone()).ok().unwrap().email_hash == input_email_hash
    ).next().unwrap();
    get_hashed_email(matches)
}