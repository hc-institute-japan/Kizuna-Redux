use hdk::{
    holochain_core_types::{
        chain_header::ChainHeader,
        link::link_data::LinkData
    },
    api::AGENT_ADDRESS,
};
use crate::profile::{
  // PublicProfile,
  PublicProfileEntry,
  PrivateProfileEntry,
  ProfileEntry
};
use crate::profile::handlers::{
  check_username,
  check_email,
  get_my_public_profile,
  get_my_private_profile
};

/*
  Checks for profile creation:
    1. Each agent should only be able to commit one registered username and profile
    2. Usernames must be unique
    3. Emails must be unique
*/
pub fn validate_public_profile_create(entry: PublicProfileEntry, validation_data: hdk::ValidationData) -> Result<(), String> {
  hdk::debug(format!("validate_entry_create_entry: {:?}", entry)).ok();
  hdk::debug(format!("validate_entry_create_validation_data: {:?}", validation_data)).ok();
  // Only 1 profile each agent
  if !get_my_public_profile()?.is_empty() {
    return Err("This agent already has a public profile".to_string())
  }
  // Usernmes must be unique
  match check_username(entry.username) {
    Ok(t) => {
      match t {
        true => Err("Username is already registered".to_string()),
        false => Ok(())
      }
    },
    Err(e) => Err(format!("An error occurred. -> {}", e.to_string()))
  }
  // Public profile must be created after a private profile has been created
  if get_my_private_profile()?.is_empty() {
    return Err("A private profile for this user does not exist yet.".to_string())
  }
}

pub fn validate_private_profile_create(entry: PrivateProfileEntry, validation_data: hdk::ValidationData) -> Result<(), String> {
  hdk::debug(format!("validate_entry_create_entry: {:?}", entry)).ok();
  hdk::debug(format!("validate_entry_create_validation_data: {:?}", validation_data)).ok();
  if !get_my_private_profile()?.is_empty() {
    return Err("This agent already has a private profile".to_string())
  }
  // Email must be unique
  match check_email(entry.email) {
    Ok(t) => {
      match t {
        true => Err("Email is already registered".to_string()),
        false => Ok(())
      }
    },
    Err(e) => Err(format!("An error occurred. -> {}", e.to_string()))
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

// HELPER FUNCTIONS