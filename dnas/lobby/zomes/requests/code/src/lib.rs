#![feature(proc_macro_hygiene)]

use hdk::prelude::*;
use hdk_proc_macros::zome;
use serde_json::json;

pub mod request;
use request::{
    RequestReturn,
};

// see https://developer.holochain.org/api/0.0.49-alpha1/hdk/ for info on using the hdk library

// This is a sample zome that defines an entry type "MyEntry" that can be committed to the
// agent's chain via the exposed function create_my_entry

#[zome]
mod requests_zome {

    #[init]
    fn init() {
        Ok(())
    }

    #[validate_agent]
    pub fn validate_agent(validation_data: EntryValidationData<AgentId>) {
        Ok(())
    }

    #[entry_def]
    fn request_def() -> ValidatingEntryType {
        request::request_definition()
    }

    #[zome_fn("hc_public")]
    fn request_to_chat(sender: Address, recipient: Address) -> ZomeApiResult<String> {
        let dna_properties = request::Members::new(sender.clone(), recipient.clone());
        // for testing set to 5000ms
        match hdk::send(recipient.clone(), json!(dna_properties.clone()).to_string(), 5000.into()) {
            Ok(_response) => {
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "request_pending".to_owned())).to_string())
            },
            _=> {
                // send a request_notif that will be linked to the recipient agent_address
                request::Request::send_request_offline(&recipient, dna_properties.members)?;
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "recipient_offline".to_owned())).to_string())
            }
        }
    }

    // could be used to ensure the joining of chat.
    #[zome_fn("hc_public")]
    fn accept_request(sender: Address) -> ZomeApiResult<String> {

        match hdk::send(sender, "request_accepted".to_owned(), 5000.into()) {
            Ok(response) => {
                let _emitted = hdk::emit_signal(
                    "request_accepted",
                    JsonString::from_json(&format!("{{\"code\": \"{}\", \"res\": {}}}", "confirmation_sent".to_owned(), response.to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "confirmation_sent".to_owned())).to_string())
            },
            _=> {
                let _emitted = hdk::emit_signal(
                    "recipient_offline",
                    JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "recipient_offline".to_owned()))
                )?;
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "recipient_offline".to_owned())).to_string())
            }
        }
    }

    // when agent comes back online and this function is called,
    // it returns an empty array even if there is a request entry to be fetched.
    #[zome_fn("hc_public")]
    fn fetch_requests() -> ZomeApiResult<Vec<RequestReturn>> {
        request::Request::fetch_requests()
    }

    #[zome_fn("hc_public")]
    fn delete_request(request_address: Address) -> ZomeApiResult<bool> {
        request::Request::delete_request(&request_address)
    }

    #[receive]
    fn receive(from: Address, payload: String) -> String {
        if payload == "request_accepted" {
            let _emitted = hdk::emit_signal(
                "request_accepted".to_string(),
                JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "request_accepted".to_owned()))
            );
            format!("{{\"code\": \"{}\"}}", "request_accepted".to_string())
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
                Ok(res) => {
                    match serde_json::from_str(&res.to_string()) {
                        Ok(response) => {
                            let call_result: Result<bool, ZomeApiError> = response;
                            match call_result {
                                Ok(r) => {
                                    let _emitted = hdk::emit_signal(
                                        "request_received",
                                        JsonString::from_json(&format!("{{\"code\": \"{}\", \"in_contacts\": \"{}\", \"addresses\": {}}}", "request_receieved".to_owned(), r, payload))
                                    );
                                    format!("{{\"code\": \"{}\", \"in_contacts\": \"{}\"}}", "request_receieved".to_owned(), r)
                                },
                                // need to handle zomeApiError from contacts
                                Err(e) => {
                                    let _emitted = hdk::emit_signal(
                                        "contact_checking_zome_interal_failed",
                                        JsonString::from_json(&format!("{{\"code\": \"{}\", \"err\": \"{}\", \"addresses\": \"{}\"}}", "contact_checking_zome_interal_failed".to_owned(), e, payload))
                                    );
                                    format!("{{\"code\": \"{}\", \"res\": \"{}\", \"in_contacts\": \"false\"}}", "contact_checking_zome_interal_failed".to_owned(), e)
                                }
                            }
                        },
                        Err(e) => {
                            let _emitted = hdk::emit_signal(
                                "contacts_checking_parsing_failed",
                                JsonString::from_json(&format!("{{\"code\": \"{}\", \"err\": \"{}\", \"addresses\": \"{}\"}}", "contacts_checking_parsing_failed".to_owned(), e, payload))
                            );
                            format!("{{\"code\": \"{}\", \"res\": \"{}\"}}", "contacts_checking_parsing_failed".to_owned(), e)
                        }
                    }
                },
                Err(e) => {
                    let _emitted = hdk::emit_signal(
                        "contacts_checking_call_failed",
                        JsonString::from_json(&format!("{{\"code\": \"{}\", \"err\": \"{}\", \"addresses\": \"{}\"}}", "contacts_checking_call_failed".to_owned(), e, payload))
                    );
                    format!("{{\"code\": \"{}\", \"err\": \"{}\"}}", "contacts_checking_call_failed".to_owned(), e)
                },
            }
        }
    }
}
