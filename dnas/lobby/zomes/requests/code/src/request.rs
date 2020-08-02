use hdk::{
    api::AGENT_ADDRESS,
    prelude::*,
};
use holochain_entry_utils::HolochainEntry;

pub const REQUEST_ENTRY_NAME: &str = "REQUEST_ENTRY_NAME";
pub const AGENT_REQUEST_LINK_TYPE: &str = "agent->request";
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Members {
    pub members: Vec<Address>,
}

#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct Request {
    pub from: Address,
    pub properties: Vec<Address>,
}
#[derive(Serialize, Deserialize, Debug, DefaultJson, Clone)]
pub struct RequestReturn {
    pub address: Address,
    pub from: Address,
    pub properties: Vec<Address>,
}

impl Members {
    pub fn new(sender: Address, recipient: Address) -> Self {
        Members {
            members: vec![sender, recipient]
        }
    }
}

impl RequestReturn {
    fn new(address: Address, request: Request) -> Self {
        RequestReturn {
            address,
            from: request.from,
            properties: request.properties,
        }
    }
}

impl HolochainEntry for Request {
    fn entry_type() -> String {
        String::from(REQUEST_ENTRY_NAME)
    }
}

impl Request {
    pub fn new(properties: Vec<Address>) -> Self {
        Request {
            from: AGENT_ADDRESS.to_string().into(),
            properties,
        }
    }

    // this may be better handled using capability token to call a private fn commit_request and commit request as private entry
    pub fn send_request_offline(recipient: &Address, properties: Vec<Address>) -> ZomeApiResult<Address> {
        let new_request_entry = Request::new(properties).entry();
        let request_address = hdk::commit_entry(&new_request_entry)?;
        hdk::link_entries(recipient, &request_address, AGENT_REQUEST_LINK_TYPE, "")?;
        Ok(request_address)
    }

    pub fn fetch_requests() -> ZomeApiResult<Vec<RequestReturn>> {
        let requests: Vec<RequestReturn> = hdk::get_links(
            &AGENT_ADDRESS,
            LinkMatch::Exactly(AGENT_REQUEST_LINK_TYPE),
            LinkMatch::Any,
        )?.addresses()
        .into_iter()
        .filter_map(|request_address| {
            match hdk::get_entry(&request_address) {
                Ok(res) => {
                    match res {
                        Some(e) => {
                            match Request::from_entry(&e) {
                                Some(r) => {
                                    let address = e.address();
                                    Some(RequestReturn::new(address, r))
                                },
                                None => None,
                            }
                        },
                        None => None,
                    }
                },
                Err(_e) => None,
            }
        }).collect();
        Ok(requests)
    }

    pub fn delete_request(request_address: &Address) -> ZomeApiResult<bool> {
        // check if the given address is actually a request entry address
        let _get_request_result = try_get_request(request_address)?;
        // We're only removing the link and not deleting the entry itself
        // so as to not unnecessary populate the DHT.
        hdk::remove_link(
            &AGENT_ADDRESS,
            request_address,
            AGENT_REQUEST_LINK_TYPE,
            "",
        )?;
        Ok(true)
    }
}

pub fn request_definition() -> ValidatingEntryType {
    entry!(
        name: Request::entry_type(),
        description: "this is a request to chat in p2pdna",
        sharing: Sharing::Public,
        validation_package: || {
            hdk::ValidationPackageDefinition::Entry
        },
        validation: |_validation_data: hdk::EntryValidationData<Request>| {
            Ok(())
        },
        links: [
            from!(
                "%agent_id",
                link_type: AGENT_REQUEST_LINK_TYPE,
                validation_package: || {
                    hdk::ValidationPackageDefinition::Entry
                },
                validation: | _validation_data: hdk::LinkValidationData | {
                    Ok(())
                }
            )
        ]
    )
}

// HELPER

fn try_get_request(request_address: &Address) -> ZomeApiResult<Request> {
    let maybe_request = hdk::get_entry(request_address)?;
    match maybe_request {
        Some(e) => {
            match Request::from_entry(&e) {
                Some(r) => Ok(r),
                None => Err(ZomeApiError::from("{\"code\": \"404\", \"message\": \"The given address did not store a request entry\"}".to_owned()))
            }
        },
        None => Err(ZomeApiError::from("{\"code\": \"204\", \"message\": \"There was no entry at the given address\"}".to_owned()))
    }
}