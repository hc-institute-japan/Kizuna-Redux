use hdk::prelude::*;
use super::{
    Contacts,
    HolochainEntry,
};

pub fn list_address() -> ZomeApiResult<Vec<Address>>{
    hdk::api::query(Contacts::entry_type().into(), 0, 0)
}

// TODO: call a get_username from profile zome to check if this address has a username
pub fn add(contact_address: Address, timestamp: usize) -> ZomeApiResult<Contacts> {

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    // let link_result = contacts_link_result()?;

    match query_result.len() {
        0 => {
            let mut new_contacts = Contacts::new(timestamp.clone());
            new_contacts.contacts.push(contact_address);
            let contacts_entry = new_contacts.clone().entry();
            hdk::commit_entry(&contacts_entry)?;
            Ok(new_contacts)
        },
        _ => {
            // gets the most recent address but may need refactoring
            let recent_contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(recent_contacts_address.clone())?;

            // check if the address to be added is already existing
            if let false = contacts.contacts.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                if contacts.timestamp != timestamp && contacts.timestamp < timestamp {
                    contacts.contacts.push(contact_address);
                    let new_contacts = Contacts::from(
                        timestamp.clone(),
                        contacts.contacts.clone(),
                        contacts.blocked.clone()
                    );
                    let _new_contacts_address = hdk::update_entry(new_contacts.clone().entry(), &recent_contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from(String::from(
                        "The timestamp is the same with or less than the previous timestamp",
                    )))
                }
            } else {
                return Err(ZomeApiError::from(String::from(
                    "This address is already added in contacts",
                )))
            }
        },
    }
}

pub fn remove(contact_address: Address, timestamp: usize) -> ZomeApiResult<Contacts> {
    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;

    match query_result.len() {
        0 => {
            return Err(ZomeApiError::from(String::from(
                "This agent has no contacts yet",
            )))
        },
        _ => {
            // may need refactoring on getting the most recent address
            let contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            if let true = contacts.contacts.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                if contacts.timestamp != timestamp && contacts.timestamp < timestamp {
                    contacts.contacts.retain(|v| &v.to_string() != &contact_address.to_string());
                    let new_contacts = Contacts::from(
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone());
                    hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from(String::from(
                        "The timestamp is the same with or less than the previous timestamp",
                    )))
                }
            } else {
                return Err(ZomeApiError::from(String::from(
                    "This address wasn't found in the contract",
                )))
            }
        },
    }
}

pub fn list_contacts() -> ZomeApiResult<Vec<Address>> {
    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    

    match query_result.len() {
        0 => {
            // Ok()
            return Err(ZomeApiError::from(String::from(
                "This agent has no contacts entry",
            )))
        },
        _ => {
            // may need refactoring on getting the most recent address
            let contacts_address = query_result[0].clone();
            let contacts: Contacts = hdk::utils::get_as_type(contacts_address)?;
            // call get_username here to return Vec<username: String>
            Ok(contacts.contacts)
        },
    }
}