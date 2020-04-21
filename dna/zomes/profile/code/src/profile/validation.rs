use hdk::{
    holochain_core_types::{
        chain_header::ChainHeader,
        link::link_data::LinkData
    }
};
use crate::profile::{
  // PublicProfile,
  PublicProfileEntry
};
use crate::profile::handlers::{
  search_username
};

pub fn validate_entry_create(entry: PublicProfileEntry, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_entry_create_entry: {:?}", entry)).ok();
    hdk::debug(format!("validate_entry_create_validation_data: {:?}", validation_data)).ok();
    Ok(())
}

/*
  Checks for profile creation:
    1. Each agent should only be able to commit one registered username and profile
    2. Usernames must be unique
    3. Emails must be unique
*/
pub fn validate_public_profile_create(entry: PublicProfileEntry, _validation_data: hdk::ValidationData) -> Result<(), String> {
  // search DHT for entries with the same agent address/public key
    // get all entries
      // ? commit provenances to PublicProfileEntry structure
    // get EntryWithMetaAndHeader
    // get provenance
    // compare provenances

  // 2. Usernmes must be unique
  let username_match = search_username(entry.username);
  match username_match {
    Ok(t) => {
      match t {
        Some(_u) => Err("Username already exists. Please choose a different one.".to_string()),
        None => Ok(())
      }
    },
    Err(_e) => Ok(())
  }
}

pub fn validate_entry_modify(new_entry: PublicProfileEntry, old_entry: PublicProfileEntry, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_entry_modify_new_entry: {:?}", new_entry)).ok();
    hdk::debug(format!("validate_entry_modify_old_entry: {:?}", old_entry)).ok();
    hdk::debug(format!("validate_entry_modify_old_entry_header: {:?}", old_entry_header)).ok();
    hdk::debug(format!("validate_entry_modify_validation_data: {:?}", validation_data)).ok();

    if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
        if o.source() == p.source() {
          Ok(())
        }
        else {
          Err("Agent who did not author is trying to update".to_string())
        }
    }
    else {
      Err("No provenance on this validation_data".to_string())
    }
}

pub fn validate_entry_delete(old_entry: PublicProfileEntry, old_entry_header: ChainHeader, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_entry_delete_old_entry: {:?}", old_entry)).ok();
    hdk::debug(format!("validate_entry_delete_old_entry_header: {:?}", old_entry_header)).ok();
    hdk::debug(format!("validate_entry_delete_validation_data: {:?}", validation_data)).ok();

    if let (Some(o), Some(p)) = (old_entry_header.provenances().get(0), validation_data.package.chain_header.provenances().get(0)) {
        if o.source() == p.source() {
          Ok(())
        }
        else {
          Err("Agent who did not author is trying to delete".to_string())
        }
    }
    else {
      Err("No provenance on this validation_data".to_string())
    }
}

pub fn validate_link_add(link: LinkData, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_link_add_link: {:?}", link)).ok();
    hdk::debug(format!("validate_link_add_validation_data: {:?}", validation_data)).ok();
    Ok(())
}

pub fn validate_link_remove(link: LinkData, validation_data: hdk::ValidationData) -> Result<(), String> {
    hdk::debug(format!("validate_link_remove_link: {:?}", link)).ok();
    hdk::debug(format!("validate_link_remove_validation_data: {:?}", validation_data)).ok();
    Ok(())
}
