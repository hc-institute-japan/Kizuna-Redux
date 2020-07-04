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
    Profile,
    HolochainEntry,
};
// use serde::Serialize;

// TODO: call a get_username from profile zome to check if this address has a username
pub fn add(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
    // checks if there is an existing username and reutnr its agent_address when there is
    let contact_address = username_address(username.clone())?;

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;

    match query_result.len() {
        0 => {
            let mut new_contacts = Contacts::new(timestamp.clone());
            new_contacts.contacts.push(contact_address.clone());
            let contacts_entry = new_contacts.entry();
            hdk::commit_entry(&contacts_entry)?;
            let added_profile = Profile::new(contact_address, username);
            Ok(added_profile)
        },
        _ => {
            // gets the most recent address but may need refactoring
            let recent_contacts_address = query_result[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(recent_contacts_address.clone())?;

            // check if the address to be added is already existing
            if let false = contacts.contacts.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                if contacts.timestamp < timestamp {
                    contacts.contacts.push(contact_address.clone());
                    let new_contacts = Contacts::from(
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone()
                    );
                    hdk::update_entry(new_contacts.entry(), &recent_contacts_address)?;
                    let added_profile = Profile::new(contact_address, username);
                    Ok(added_profile)
                } else {
                    // temporary code
                    return Err(ZomeApiError::from("{\"code\": \"321\", \"message\": \"The timestamp is the same with or less than the previous timestamp\"}".to_owned()))
                }
            } else {
                // temporary code
                return Err(ZomeApiError::from("{\"code\": \"402\", \"message\": \"This address is already added in contacts\"}".to_owned()))
            }
        },
    }
}

pub fn remove(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
    let contact_address = username_address(username.clone())?;
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
                if contacts.timestamp < timestamp {
                    contacts.contacts.retain(|v| &v.to_owned() != &contact_address.to_owned());
                    let new_contacts = Contacts::from(
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone());
                    hdk::update_entry(new_contacts.entry(), &contacts_address)?;
                    let removed_profile = Profile::new(contact_address, username);
                    Ok(removed_profile)
                } else {
                    return Err(ZomeApiError::from("{\"code\": \"321\", \"message\": \"The timestamp is the same with or less than the previous timestamp\"}".to_owned()))
                }
            } else {
                return Err(ZomeApiError::from("{\"code\": \"404\", \"message\": \"This address wasn't found in contacts\"}".to_owned()))
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

pub fn in_contacts(id: Address) -> ZomeApiResult<bool> {
    let contacts_list = list_contacts()?;
    if contacts_list.len() == 0 {
        Ok(false)
    } else {
        if contacts_list.iter().any(|address| address.to_string()==id.to_string()) {
            Ok(true)
        } else {
            Ok(false)
        }
    }
}

pub fn block(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
    let contact_address = username_address(username.clone())?;

    if contact_address.to_owned() == AGENT_ADDRESS.to_owned() {
        return Err(ZomeApiError::from("{\"code\": \"302\", \"message\": \"Cannot block own agent id.\"}".to_owned()))
    }

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    
    match query_result.len() {
        0 => {
            let mut new_contacts = Contacts::new(timestamp.clone());
            new_contacts.blocked.push(contact_address.clone());
            let contacts_entry = new_contacts.entry();
            hdk::commit_entry(&contacts_entry)?;
            let blocked_profile = Profile::new(contact_address, username);
            Ok(blocked_profile)
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
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );

                    // check if the contact is in the list of contacts
                    if let true = new_contacts.contacts.iter().any(|v| &v.to_owned() == &contact_address.to_owned()) {
                        new_contacts.contacts.retain(|v| &v.to_owned() != &contact_address.to_owned());
                    }

                    hdk::update_entry(new_contacts.entry(), &contacts_address)?;
                    let blocked_profile = Profile::new(contact_address, username);
                    Ok(blocked_profile)
                } else {
                    return Err(ZomeApiError::from("{\"code\": \"402\", \"message\": \"The contact is already in the list of blocked contacts\"}".to_owned()))
                } 
            } else {
                return Err(ZomeApiError::from("{\"code\": \"321\", \"message\": \"The timestamp is the same with or less than the previous timestamp\"}".to_owned()))
            }  
        }
    }
}

pub fn unblock(username: String, timestamp: u64) -> ZomeApiResult<Profile> {
    let contact_address = username_address(username.clone())?;

    if contact_address.to_owned() == AGENT_ADDRESS.to_owned() {
        return Err(ZomeApiError::from("{\"code\": \"302\", \"message\": \"Cannot unblock own agent id\"}".to_owned()))
    }

    let query_result = hdk::api::query(Contacts::entry_type().into(), 0, 0)?;
    
    match query_result.len() {
        0 => {
            return Err(ZomeApiError::from("{\"code\": \"405\", \"message\": \"This agent has no contacts yet\"}".to_owned()))
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
                        timestamp,
                        contacts.contacts.clone(),
                        contacts.blocked.clone(),
                    );
                    hdk::update_entry(new_contacts.entry(), &contacts_address)?;
                    let unblocked_profile = Profile::new(contact_address, username);
                    Ok(unblocked_profile)
                } else {
                    return Err(ZomeApiError::from("{\"code\": \"404\", \"message\": \"The contact is not in the list of blocked contacts\"}".to_owned()))
                } 
            } else {
                return Err(ZomeApiError::from("{\"code\": \"321\", \"message\": \"The timestamp is the same with or less than the previous timestamp\"}".to_owned()))
            }  
        }
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

// CROSS ZOME HELPER FUNCTION
fn username_address(username: String) -> ZomeApiResult<Address> {

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
        _ => Err(ZomeApiError::from("{\"code\": \"802\", \"message\": \"Parsing was unsuccessful\"}".to_owned()))
    }
    
}
