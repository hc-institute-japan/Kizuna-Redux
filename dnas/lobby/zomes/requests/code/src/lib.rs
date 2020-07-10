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
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "request_pending".to_owned())).to_string())
            },
            _=> {
                // send a request_notif that will be linked to the recipient agent_address
                Ok(JsonString::from_json(&format!("{{\"code\": \"{}\"}}", "recipient_offline".to_owned())).to_string())
            }
        }
    }

    #[zome_fn("hc_public")]
    fn accept_request(sender: Address) -> ZomeApiResult<String> {

        match hdk::send(sender, "request_accepted".to_owned(), 10000.into()) {
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
                                    // need to handle zomeApiError
                                    let _emitted = hdk::emit_signal(
                                        payload,
                                        JsonString::from_json(&format!("{{\"code\": \"{}\", \"in_contacts\": \"{}\"}}", "request_receieved".to_owned(), r))
                                    );
                                    format!("{{\"code\": \"{}\", \"in_contacts\": \"{}\"}}", "request_receieved".to_owned(), r)
                                },
                                Err(e) => {
                                    let _emitted = hdk::emit_signal(
                                        payload,
                                        JsonString::from_json(&format!("{{\"code\": \"{}\", \"err\": \"{}\"}}", "contact_checking_failed".to_owned(), e))
                                    );
                                    format!("{{\"code\": \"{}\", \"res\": \"{}\"}}", "contact_checking_failed".to_owned(), e)
                                }
                            }
                        },
                        Err(e) => {
                            let _emitted = hdk::emit_signal(
                                payload,
                                JsonString::from_json(&format!("{{\"code\": \"{}\", \"err\": \"{}\"}}", "parsing_failed".to_owned(), e))
                            );
                            format!("{{\"code\": \"{}\", \"res\": \"{}\"}}", "parsing_failed".to_owned(), e)
                        }
                    }
                },
                Err(e) => {
                    format!("{{\"code\": \"{}\", \"err\": \"{}\"}}", "contact_checking_failed".to_owned(), e)
                },
            }
        }
    }
}
