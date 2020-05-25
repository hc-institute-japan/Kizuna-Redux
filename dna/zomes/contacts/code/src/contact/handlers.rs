use hdk::{
    prelude::*,
    api::AGENT_ADDRESS,
};
// use serde_json::{
//     json,
//     from_str,
//     Value
// };
use super::{
    Contacts,
    HolochainEntry,
};
// use serde::Serialize;

// TODO: call a get_username from profile zome to check if this address has a username
pub fn add(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;

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
            if let false = contacts.contacts.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                if contacts.timestamp != timestamp && contacts.timestamp < timestamp {
                    contacts.contacts.push(contact_address);
                    let new_contacts = Contacts::from(
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone()
                    );
                    hdk::update_entry(new_contacts.clone().entry(), &recent_contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from("The timestamp is the same with or less than the previous timestamp".to_owned()))
                }
            } else {
                return Err(ZomeApiError::from("This address is already added in contacts".to_owned()))
            }
        },
    }
}

pub fn remove(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {
    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;

    match query_result.len() {
        0 => {
            return Err(ZomeApiError::from("This agent has no contacts yet".to_owned()))
        },
        _ => {
            // may need refactoring on getting the most recent address
            let contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            if let true = contacts.contacts.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                if contacts.timestamp != timestamp && contacts.timestamp < timestamp {
                    contacts.contacts.retain(|v| &v.to_owned() != &contact_address.to_owned());
                    let new_contacts = Contacts::from(
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone());
                    hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from("The timestamp is the same with or less than the previous timestamp".to_owned()))
                }
            } else {
                return Err(ZomeApiError::from("This address wasn't found in the contract".to_owned()))
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
            Ok(contacts.contacts)
        },
    }

}

pub fn list_blocked() -> ZomeApiResult<Vec<Address>> {
    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;

    match query_result.len() {
        0 => {
            let empty_blocked: Vec<Address> = Vec::default();
            Ok(empty_blocked)
        },
        _ => {
            // may need refactoring on getting the most recent address
            let contacts_address = query_result[0].clone();
            let contacts: Contacts = hdk::utils::get_as_type(contacts_address)?;
            Ok(contacts.blocked)
        },
    }

    
}

pub fn block(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

    if contact_address.to_owned() == AGENT_ADDRESS.to_owned() {
        return Err(ZomeApiError::from("Cannot block yourself".to_owned()))
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
                if let false = contacts.blocked.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                    contacts.blocked.push(contact_address.clone());

                    let mut new_contacts = Contacts::from(
                        timestamp.clone(),
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );

                    // check if the contact is in the list of contacts
                    if let true = new_contacts.contacts.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                        new_contacts.contacts.retain(|v| &v.to_owned() != &contact_address.to_owned());
                    }

                    let _new_contacts_address = hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from("The contact is already in the list of blocked contacts".to_owned()))
                } 
            } else {
                return Err(ZomeApiError::from("The timestamp is the same with or less than the previous timestamp".to_owned()))
            }  
        }
    }
}

pub fn unblock(contact_address: Address, timestamp: u64) -> ZomeApiResult<Contacts> {

    if contact_address.to_owned() == AGENT_ADDRESS.to_owned() {
        return Err(ZomeApiError::from("Unblocking own agent id".to_owned()))
    }

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    
    match query_result.len() {
        0 => {
            return Err(ZomeApiError::from("This agent has no contacts yet".to_owned()))
        },
        _ => {
            let contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            
            // compare timestamps
            if let true = contacts.timestamp < timestamp {
                // check if the contact is in the blocked list
                if let true = contacts.blocked.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                    contacts.blocked.retain(|v| &v.to_owned() != &contact_address.to_owned());

                    let new_contacts = Contacts::from(
                        timestamp.clone(),
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );
                    let _new_contacts_address = hdk::update_entry(new_contacts.clone().entry(), &contacts_address)?;
                    Ok(new_contacts)
                } else {
                    return Err(ZomeApiError::from("The contact is not in the list of blocked contacts".to_owned()))
                } 
            } else {
                return Err(ZomeApiError::from("The timestamp is the same with or less than the previous timestamp".to_owned()))
            }  
        }
    }
}

pub fn username_address(username: String) -> ZomeApiResult<Address> {

    #[derive(Serialize, Deserialize, Debug, DefaultJson)]
    struct ZomeInput {
        username: String
    };
    let call_input = ZomeInput {
        username,
    };

    let user_address_string = hdk::call(
        hdk::THIS_INSTANCE, 
        "profiles", 
        Address::from(hdk::PUBLIC_TOKEN.to_owned()), 
        "get_address_from_username", 
        call_input.into()
    )?;

    match serde_json::from_str(&user_address_string.to_string()) {
        Ok(result) => result,
        _ => Err(ZomeApiError::from("Parsing was unsuccessful".to_owned()))
    }
    
}
