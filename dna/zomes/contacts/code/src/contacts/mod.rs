use hdk::{
    prelude::*,
    AGENT_ADDRESS,
};

pub mod handlers;
pub mod strings;
use strings::*;
use holochain_entry_utils::HolochainEntry;

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Contacts {
    anchor: Address,
    contacts: Vec<Address>,
    blocked: Vec<Address>,
}
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct ContactsAnchor {
    agent_id: Address,
    timestamp: usize
}

impl HolochainEntry for Contacts {
    fn entry_type() -> String {
        String::from(CONTACTS_ENTRY_NAME)
    }
}

impl Contacts {
    fn new(anchor_address: Address) -> Self {
        Contacts {
            anchor: anchor_address,
            contacts: Vec::new(),
            blocked: Vec::new(),
        }
    } 
}

impl HolochainEntry for ContactsAnchor {
    fn entry_type() -> String {
        String::from(ANCHOR_CONTACTS_LINK_TYPE)
    }
}

impl ContactsAnchor {
    fn new (timestamp: usize) -> Self {
        ContactsAnchor {
            agent_id: AGENT_ADDRESS.to_string().into(),
            timestamp,
        }
    }
}

pub fn contacts_definition() -> ValidatingEntryType {
    entry!(
        name: Contacts::entry_type(),
        description: "this is the contacts of the agent",
        sharing: Sharing::Private,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<Contacts>| {
            Ok(())
        },
        // Is there any attack vector from linking private entries considering that links are a public entry?
        from!(
            ContactsAnchor::entry_type(),
            link_type: ANCHOR_CONTACTS_LINK_TYPE,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::LinkValidationData | {
                Ok(())
            }
        )  
    )
}

pub fn contacts_anchor_definition() -> ValidatingEntryType {
    entry!(
        name: ContactsAnchor::entry_type(),
        description: "this is the contacts of the agent",
        sharing: Sharing::Private,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: | _validation_data: hdk::EntryValidationData<Contacts>| {
            Ok(())
        },
        from!(
            "%agent_id",
            link_type: AGENT_CONTACTS_ANCHOR_LINK_TYPE,
            validation_package: || {
                hdk::ValidationPackageDefinition::Entry
            },
            validation: | _validation_data: hdk::LinkValidationData | {
                Ok(())
            }
        )  
    )
}