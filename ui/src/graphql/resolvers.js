import { createZomeCall } from "../connection/holochainClient";

/*
Holochain structure:
- instance name: test-instance
- zome name: profile
- available zome functions:
-- list_public_profiles
-- search_username
-- create_public_profile
-- create_private_profile
ZomeCall Structure:
-- createZomeCall('<instance_name>/<zome_name>/<function_name>)(arguments)
* argument key should be the same as the declared input name in the holochain function declarations
*/


const resolvers = {
    Query: {
        listProfiles: async () => 
            (await createZomeCall('/test-instance/profile/list_public_profiles')()),
        searchUsername: async (_,  username ) =>
            (await createZomeCall('/test-instance/profile/search_username')( { username: username.username } )),
        getLinkedProfile: async (_, username) =>
            (await createZomeCall('test-instance/profile/get_linked_profile')( { username: username.username } )),
        getHashedEmails: async (_, email) => 
            (await createZomeCall('/test-instance/profile/get_hashed_emails')( { email: email.email } )),
        isEmailRegistered: async (_, email) =>
            (await createZomeCall('/test-instance/profile/is_email_registered')( { email: email.email }))
    },

    Mutation: {
        registerUsername: async (_, username ) => 
            (await createZomeCall('/test-instance/profile/create_public_profile')( { input: username.profile_input } )),
        createProfile: async (_, profileDetails ) => 
            (await createZomeCall('/test-instance/profile/create_private_profile')( { input: profileDetails.profile_input } )),
        register: async (_, profile_details) =>
            (await createZomeCall('/test-instance/profile/register')( { public_input: profile_details.public_input, private_input: profile_details.private_input} ))
    }
};

export default resolvers;
