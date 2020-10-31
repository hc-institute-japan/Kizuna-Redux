// See https://trello.com/c/f6pN3WLk/316-error-codes for error codes explanation.
const genericError = "unexpected error has occured. Please try again later.";

// This corresponds to the mutation and query we have.
// If the same error codes are not being used twice in the same zome,
// then we are not separating them by their function names.

const errorMessages: any = {
  profiles: {
    202: "Sorry! This username is already exisiting.",
    204: "Sorry! There is no user with that username.",
    302: "You already have a username.",
    406: "Please input a username.",
    407: "You have more than two usernames registered.",
    800: genericError,
  },
  contacts: {
    addContact: {
      204: "Sorry! We could not find a user with this username.",
      321: genericError,
      402: "This address is already in your contacts.",
      406: "Please input a username!",
      800: genericError,
      802: genericError,
    },
    removeContact: {
      204: "Sorry! We could not find a user with this username.",
      321: genericError,
      404: "Sorry! We could not find this address in your contacts.",
      406: "Please input a username!",
      800: genericError,
      802: genericError,
    },
    blockContact: {
      204: "Sorry! We could not find a user with this username.",
      302: "Sorry! You can't block yourself.",
      321: genericError,
      402: "You already blocked this address.",
      406: "Please input a username!",
      800: genericError,
      802: genericError,
    },
    unblockContact: {
      204: "Sorry! We could not find a user with this username.",
      302: "Sorry! You can't unblock yourself.",
      321: genericError,
      404: "Sorry! We could not find this address in your blocked contacts.",
      405: "You have not blocked anyone yet!",
      406: "Please input a username!",
      800: genericError,
      802: genericError,
    },
  },
  500: "Network error has occurred. Please try again later.",
};

export default errorMessages;
