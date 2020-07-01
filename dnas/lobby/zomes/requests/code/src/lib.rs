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
    fn request_to_chat(recipient: Address, dna_properties: Members) -> ZomeApiResult<String> {
        hdk::send(
            recipient,
            json!(dna_properties).to_string(),
            10000.into()
        )
    }

    #[zome_fn("hc_public")]
    fn accept_request(sender: Address) -> ZomeApiResult<String> {
        hdk::send(
            sender,
            "request_accepted".into(),
            10000.into()
        )
    }

    #[receive]
    fn receive(from: Address, payload: String) -> String {
        format!("Received: {} from {}", payload, from)
    }
}
