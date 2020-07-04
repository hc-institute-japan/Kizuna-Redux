#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;
use serde_json::json;

// see https://developer.holochain.org/api/0.0.49-alpha1/hdk/ for info on using the hdk library

// This is a sample zome that defines an entry type "MyEntry" that can be committed to the
// agent's chain via the exposed function create_my_entry

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Members {
    members: Vec<Address>,
}

impl Members {
    fn new(sender: Address, recipient: Address) -> Self {
        Members {
            members: vec![sender, recipient]
        }
    }
}

#[zome]
mod requests {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[zome_fn("hc_public")]
    fn request_to_chat(sender: Address, recipient: Address) -> ZomeApiResult<String> {
        let dna_properties = Members::new(sender.clone(), recipient.clone());
        match hdk::send(recipient, json!(dna_properties).to_string(), 10000.into()) {
            Ok(_response) => {
                let _emitted = hdk::emit_signal(
                    "request_pending",
                    JsonString::from_json(&format!("{{code: {}}}", "request_pending".to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{code: {}}}", "request_pending".to_owned())).to_string())
            },
            _=> {
                let _emitted = hdk::emit_signal(
                    "recipient_offline",
                    JsonString::from_json(&format!("{{code: {}}}", "recipient_offline".to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{code: {}}}", "recipient_offline".to_owned())).to_string())
            }
        }
    }

    #[zome_fn("hc_public")]
    fn accept_request(sender: Address) -> ZomeApiResult<String> {

        match hdk::send(sender, "request_accepted".to_owned(), 10000.into()) {
            Ok(_response) => {
                let _emitted = hdk::emit_signal(
                    "request_accepted",
                    JsonString::from_json(&format!("{{code: {}}}", "confirmation_sent".to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{code: {}}}", "confirmation_sent".to_owned())).to_string())
            },
            _=> {
                let _emitted = hdk::emit_signal(
                    "recipient_offline",
                    JsonString::from_json(&format!("{{code: {}}}", "recipient_offline".to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{code: {}}}", "recipient_offline".to_owned())).to_string())
            }
        }
    }

    #[receive]
    fn receive(from: Address, payload: String) -> String {
        if payload == "request_accepted" {
            let _emitted = hdk::emit_signal(
                "request_accepted".to_string(),
                JsonString::from_json(&format!("{{code: {}}}", "request_accepted".to_owned()))
            );
            format!("{{code: {}}}", "request_accepted".to_string())
        } else {
            // check contacts membership
            #[derive(Serialize, Deserialize, Debug, DefaultJson)]
            struct ZomeInput {
                id: Address
            };
            let call_input = ZomeInput {
                id: from
            };

            let call_response = hdk::call(
                hdk::THIS_INSTANCE,
                "contacts",
                Address::from(hdk::PUBLIC_TOKEN.to_owned()),
                "in_contacts",
                call_input.into()
            );

            match call_response {
                Ok(response) => {
                    let in_contacts = response;
                    let _emitted = hdk::emit_signal(
                        payload,
                        JsonString::from_json(&format!("{{code: {}, in_contacts: {}}}", "request_receieved".to_owned(), in_contacts))
                    );
                    format!("{{code: {}, in_contacts: {}}}", "request_receieved".to_owned(), in_contacts)
                },
                _ => {
                    let _emitted = hdk::emit_signal(
                        payload,
                        JsonString::from_json(&format!("{{code: {}}}", "contact_checking_failed".to_owned()))
                    );
                    format!("{{code: {}}}", "contact_checking_failed".to_owned())
                }
            }

        }
    }
}
