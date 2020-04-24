#![allow(dead_code)]
#![allow(unused_imports)]

use hdk::{
    error::ZomeApiResult,
    // holochain_core_types::{
    //     entry::Entry,
    // },
    holochain_persistence_api::cas::content::{
        Address,
    },
    prelude::*,
    AGENT_ADDRESS
};
use holochain_anchors::anchor;
use crate::profile::{
    PublicProfile,
    PublicProfileEntry,
    PrivateProfile,
    PrivateProfileEntry,
    HashedEmail,
    HashedEmailEntry,
    EmailString,
    ProfileEntry
};
use crate::profile::strings::*; 
use std::collections::hash_map::DefaultHasher;
use std::hash::{
    Hash, 
    Hasher
};


// HANDLER MODULE UNDER THE PROFILE CRATE

// anchor_profile()
// attach anchors to newly created profiles
// anchor format: 
//      anchor type: 'PRIVATE_PROFILE_<first character of username>' or 'PUBLIC_PROFILE_<first character of username>'
//      anchor text: 'PRIVATE_PROFILES_<first character of username>' or 'PUBLIC_PROFILES_<first character of username>'
fn anchor_profile(anchor_type: String, anchor_text: String, username: String) -> ZomeApiResult<Address> {
    let first_letter = username.chars().next().unwrap().to_ascii_lowercase();
    let type_string = format!("{}{}{}", anchor_type, "_", first_letter);
    let text_string = format!("{}{}{}", anchor_text, "_", first_letter);
    anchor(type_string.to_string(), text_string.to_string())
}
// fn anchor_profile_2(anchor_type: String, anchor_text: String) -> ZomeApiResult<Address> {
//     anchor(anchor_type.to_string(), anchor_text.to_string())
// }

pub fn calculate_hash<T: Hash>(t: &T) -> u64 {
    let mut s = DefaultHasher::new();
    t.hash(&mut s);
    s.finish()
}

pub fn compare_hashes (hash: u64) -> ZomeApiResult<bool> {
    let matches = hdk::get_links(
        &anchor_profile(
            HASHED_EMAIL_ANCHOR_TYPE.to_string(),
            HASHED_EMAIL_ANCHOR_TEXT.to_string(),
            hash.to_string()
        )?,
        LinkMatch::Exactly(HASHED_EMAIL_LINK_TYPE),
        LinkMatch::Any
    )?.addresses().into_iter();
    let mut result = false;
    for address in matches {
        let entry = get_hashed_email(address)?;
        if entry.email_hash == hash {
            result = true;
            break;
        } else {
            ()
        }
    };
    Ok(result)
}

pub fn check_email (email: String) -> ZomeApiResult<bool> {
    let input_email = EmailString{email: email};
    let input_email_hash = calculate_hash(&input_email);
    compare_hashes(input_email_hash)
}

// search_username()
// argument(s): PublicProfileEntry
// return value: Vector of PublicProfile
pub fn check_username(username: String) -> ZomeApiResult<bool> {
    let username_checker = hdk::get_links(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(), 
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),
            username.clone()
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE), 
        LinkMatch::Exactly(&username)
    )?.addresses().is_empty();
    let mut result = false;
    if username_checker == false {
        result = true;
    }
    Ok(result)
}


// create_private_profile(), create_public_profile()
// argument(s): PrivateProfileEntry, PublicProfileEntry
// return value: PrivateProfile, PublicProfile
pub fn create_private_profile(input: PrivateProfileEntry) -> ZomeApiResult<PrivateProfile> {
    // create an entry with entry() then commits the entry to the DHT and gets the address of the committed entry
    let address = hdk::commit_entry(&input.clone().entry())?;
    hdk::link_entries(
        &AGENT_ADDRESS,                                 // base
        &address,                                       // target
        AGENT_PRIVATE_LINK_TYPE,                        // link_type
        "private_profile"                               // tag
    )?;
    create_hashed_email(input.clone())?;
    PrivateProfile::new(address, input)
}

pub fn create_public_profile(input: PublicProfileEntry) -> ZomeApiResult<PublicProfile> {
    let address = hdk::commit_entry(&input.clone().entry())?;
    hdk::link_entries(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(),        // PUBLIC_PROFILE
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),        // PUBLIC_PROFILES
            input.username.clone().to_ascii_lowercase()     // <username input> to concatenate to anchor type and text
        )?, 
        &address,                                           // address of the entry in the dht
        PUBLIC_PROFILE_LINK_TYPE,                           // PUBLIC_PROFILE_LINK
        &input.username.to_ascii_lowercase()                // tag: lowercased username (for easier searching)
    )?;
    hdk::link_entries(
        &AGENT_ADDRESS,                                     // base
        &address,                                           // target
        AGENT_PUBLIC_LINK_TYPE,                             // link_type
        "public_profile"                                    // tag
    )?;
    PublicProfile::new(address, input)
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

pub fn get_my_private_profile() -> ZomeApiResult<Vec<PrivateProfile>> {
    hdk::get_links(
        &AGENT_ADDRESS, 
        LinkMatch::Exactly(AGENT_PRIVATE_LINK_TYPE), 
        LinkMatch::Exactly("private_profile")
    )?.addresses().into_iter().map(|profile_address| {
        get_private_profile(profile_address)
    }).collect()
  }

pub fn get_my_public_profile() -> ZomeApiResult<Vec<PublicProfile>> {
    hdk::get_links(
        &AGENT_ADDRESS, 
        LinkMatch::Exactly(AGENT_PUBLIC_LINK_TYPE), 
        LinkMatch::Exactly("public_profile")
    )?.addresses().into_iter().map(|profile_address| {
        get_public_profile(profile_address)
    }).collect()
}

fn get_hashed_email(id: Address) -> ZomeApiResult<HashedEmail> {
    let entry: HashedEmailEntry = hdk::utils::get_as_type(id.clone())?;
    HashedEmail::new(id, entry.email_hash)
}

// list_public_profiles()
// argument(s): none (can be changed to username)
// return value: Vector of PublicProfile
pub fn list_public_profiles(username: String) -> ZomeApiResult<Vec<PublicProfile>> {
    hdk::get_links(
        &anchor_profile(
            PUBLIC_PROFILES_ANCHOR_TYPE.to_string(),        // anchor_type: PUBLIC_PROFILE_n
            PUBLIC_PROFILES_ANCHOR_TEXT.to_string(),        // anchor_text: PUBLIC_PROFILES_n
            username,
        )?, 
        LinkMatch::Exactly(PUBLIC_PROFILE_LINK_TYPE),       // link_type: PUBLIC_PROFILE_LINK
        LinkMatch::Any                                      // tag: nicko
    // iterate over the Vec<ZomeApiResult<Entry>> result
    )?.addresses().into_iter().map(|profile_address| {
        get_public_profile(profile_address)
    }).collect()
}
