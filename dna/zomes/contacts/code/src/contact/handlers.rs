#![allow(unused_imports)]

use hdk::{
    prelude::*,
    api::AGENT_ADDRESS,
    // holochain_core_types::hash::*,
    holochain_json_api::json::*
};
use serde_json::{
    json,
    from_str,
    Value
};
use super::{
    Contacts,
    HolochainEntry,
};
use serde::Serialize;

pub fn list_address() -> ZomeApiResult<Vec<Address>>{
    hdk::api::query(Contacts::entry_type().into(), 0, 0)
}

// TODO: call a get_username from profile zome to check if this address has a username
pub fn add(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

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

pub fn remove(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {
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
            let empty_contacts: Vec<Address> = Vec::default();
            Ok(empty_contacts)
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

pub fn list_blocked() -> ZomeApiResult<Vec<Address>> {
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
            Ok(contacts.blocked)
        },
    }

    
}

// fn contacts_link_result() -> ZomeApiResult<GetLinksResult> {
//     hdk::get_links(
//         &hdk::api::AGENT_ADDRESS,
//         LinkMatch::Exactly(AGENT_CONTACTS_LINK_TYPE),
//         LinkMatch::Exactly("contacts")
//     )
// }


pub fn username_address(username: String) -> ZomeApiResult<Address> {

    #[derive(Serialize, Deserialize, Debug, DefaultJson)]
    struct ZomeInput {
        username: String
    };
    let call_input = ZomeInput {
        username: username
    };

    let user_address_string = hdk::call(
        hdk::THIS_INSTANCE, 
        "profiles", 
        Address::from(hdk::PUBLIC_TOKEN.to_string()), 
        "get_address_from_username", 
        call_input.into()
    )?;

    let username_address: Address = serde_json::from_str(&user_address_string.to_string()).unwrap();

    Ok(username_address)
    
}

pub fn block(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

    if contact_address.to_string() == AGENT_ADDRESS.to_string() {
        return Err(ZomeApiError::from(String::from(
            "Cannot block yourself",
        )))
    }

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    
    match query_result.len() {
        0 => {
            let mut new_contacts = Contacts::new(timestamp.clone());
            new_contacts.blocked.push(contact_address);
            let contacts_entry = new_contacts.clone().entry();
            hdk::commit_entry(&contacts_entry)?;
            Ok(new_contacts)
        },
        _ => {
            let contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            
            // compare timestamps
            if let true = contacts.timestamp < timestamp {
                // check if the contact is already in the blocked list
                if let false = contacts.blocked.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                    contacts.blocked.push(contact_address.clone());

                    let mut new_contacts = Contacts::from(
                        timestamp.clone(),
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );

                    // check if the contact is in the list of contacts
                    if let true = new_contacts.contacts.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                        new_contacts.contacts.retain(|v| &v.to_string() != &contact_address.to_string());
                    }

                    let _new_contacts_address = hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from(String::from(
                        "The contact is already in the list of blocked contacts",
                    )))
                } 
            } else {
                return Err(ZomeApiError::from(String::from(
                    "The timestamp is the same with or less than the previous timestamp",
                )))
            }  
        }
    }
}

pub fn unblock(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

    if contact_address.to_string() == AGENT_ADDRESS.to_string() {
        return Err(ZomeApiError::from(String::from(
            "Unblocking own agent id",
        )))
    }

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    
    match query_result.len() {
        0 => {
            return Err(ZomeApiError::from(String::from(
                "This agent has no contacts yet",
            )))
        },
        _ => {
            let contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            
            // compare timestamps
            if let true = contacts.timestamp < timestamp {
                // check if the contact is in the blocked list
                if let true = contacts.blocked.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                    contacts.blocked.retain(|v| &v.to_string() != &contact_address.to_string());

                    let new_contacts = Contacts::from(
                        timestamp.clone(),
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );
                    let _new_contacts_address = hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from(String::from(
                        "The contact is not in the list of blocked contacts",
                    )))
                } 
            } else {
                return Err(ZomeApiError::from(String::from(
                    "The timestamp is the same with or less than the previous timestamp",
                )))
            }  
        }
    }
}
