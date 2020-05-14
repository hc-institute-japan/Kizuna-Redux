use hdk::{
    api::AGENT_ADDRESS,
    prelude::*,
};
use super::{
    strings::*,
    Contacts,
    HolochainEntry,
};

// TODO: call a get_username from profile zome to check if this address has a username
pub fn add(contact_address: Address, timestamp: usize) -> ZomeApiResult<Address> {

    let link_result = contacts_link_result()?;

    match link_result.links().len() {
        0 => {
            let mut new_contacts = Contacts::new(timestamp.clone());
            new_contacts.contacts.push(contact_address);
            let contacts_entry = new_contacts.entry();
            let contacts_address = hdk::utils::commit_and_link(
                &contacts_entry,
                &AGENT_ADDRESS,
                AGENT_CONTACTS_LINK_TYPE,
                "contacts"
            )?;
            Ok(contacts_address)
        },
        1 => {
            let old_contacts_address = link_result.addresses()[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(old_contacts_address.clone())?;
            contacts.contacts.push(contact_address);
            let new_contacts = Contacts::from(
                timestamp.clone(),
                contacts.contacts.clone(),
                contacts.blocked.clone()
            );
            let new_contacts_address = hdk::update_entry(new_contacts.entry(), &old_contacts_address)?;
            Ok(new_contacts_address)
        },
        _ => {
            return Err(ZomeApiError::from(String::from(
                "This agent has more than two contacts entries",
            )))
        },
    }
}

pub fn remove(contact_address: Address, timestamp: usize) -> ZomeApiResult<bool> {
    let link_result = contacts_link_result()?;

    match link_result.links().len() {
        1 => {
            let contacts_address = link_result.addresses()[0].clone();
            let mut contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            if let true = contacts.contacts.iter().any(|v| &v.to_string() == &contact_address.to_string()) {
                contacts.contacts.retain(|v| &v.to_string() != &contact_address.to_string());
                let new_contacts = Contacts::from(
                    timestamp,
                    contacts.contacts.clone(),
                    contacts.blocked.clone());
                hdk::update_entry(new_contacts.entry(), &contacts_address)?;
                Ok(true)
            } else {
                return Err(ZomeApiError::from(String::from(
                    "This address wasn't found in the contract",
                )))
            }
        },
        0 => {
            return Err(ZomeApiError::from(String::from(
                "This agent has no contacts yet",
            )))
        },
        _ => {
            return Err(ZomeApiError::from(String::from(
                "This agent has more than one contacts entry",
            )))
        },
    }
}

pub fn list_contacts() -> ZomeApiResult<Vec<Address>> {
    let link_result = contacts_link_result()?;

    match link_result.links().len() {
        1 => {
            let contacts_address = link_result.addresses()[0].clone();
            let contacts: Contacts = hdk::utils::get_as_type(contacts_address.clone())?;
            // call get_username here to return Vec<username: String>
            Ok(contacts.contacts)
        },
        0 => {
            Ok(Vec::default())
        },
        _ => {
            return Err(ZomeApiError::from(String::from(
                "This agent has more than one contacts entry",
            )))
        },
    }
}

fn contacts_link_result() -> ZomeApiResult<GetLinksResult> {
        hdk::get_links(
            &AGENT_ADDRESS,
            LinkMatch::Exactly(AGENT_CONTACTS_LINK_TYPE),
            LinkMatch::Exactly("contacts")
        )
}