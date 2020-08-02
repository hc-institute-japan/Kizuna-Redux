import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSignal } from "../connection/holochainClient";
import INITIALIZE_P2P_DNA from "../graphql/p2pcomm/mutations/initializeP2PDNAMutation";
import CONVERSATION_FROM_ID from "../graphql/messages/query/getConversationFromIdQuery";
import CONVERSATION_FROM_IDS from "../graphql/messages/query/getConversationFromIdsQuery";
import P2P_COMM_INSTANCES from "../graphql/p2pcomm/query/getP2PCommInstancesQuery";
import FETCH_REQUEST_AND_JOIN_P2P_COMM from "../graphql/requests/mutations/fetchRequestAndJoinP2PCommMutation";
import USERNAME from "../graphql/query/usernameQuery";
import CONTACTS from "../graphql/query/listContactsQuery";
import { getUsername } from "../redux/contacts/actions";
import { logMessage } from "../redux/conversations/actions";
import { setContacts } from "../redux/contacts/actions";
import { RootState } from "../redux/reducers";
import { Conversation, Message, P2PInstance, Profile, Members } from "../utils/types";

/**
 *
 * @file Contains the p2p implementation used within the app
 *
 */

const P2PContainer: React.FC = ({ children }) => {
  const [hasFetched, setHasFetched] = useState(false);

  const { contacts } = useSelector(
    (state: RootState) => state.contacts
  );

  useQuery(CONTACTS, {
    fetchPolicy: "no-cache",
    skip: hasFetched,
    onCompleted: data => {
      setHasFetched(true);
      dispatch(setContacts(data ? data.contacts : contacts));
    },
    onError: (error) => {
      // this needs to be fixed later on
      // how to use pushErr in this container?
      // pushErr(error, {}, "contacts");
    },
  });

  // changed
  const dispatch = useDispatch();
  const {
    profile: { id },
  } = useSelector((state: RootState) => state.profile);

  useEffect(() => console.log(id), [id]);
  const [latestMsg, setLatestMsg] = useState({
    payload: "",
    createdAt: 0,
    author: "",
  });

  const [P2PInstances, setP2PInstances] = useState<Array<P2PInstance>>([]);

  const [getConversationFromIds] = useLazyQuery(CONVERSATION_FROM_IDS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const conversationData = data?.getConversationFromIds;
      console.log(data);
      console.log(P2PInstances);
      const messages = data.getConversationFromIds.messages;
      const transformedMessages: Array<Message> = messages.map(
        (message: any): Message => {
          return {
            sender: message.authorUsername,
            payload: message.payload,
            createdAt: message.timestamp,
          };
        }
      );
      const conversation: Conversation = {
        name: conversationData.name,
        address: conversationData.address,
        messages: transformedMessages,
        instanceId: data?.getConversationFromIds.instanceId,
      };
      dispatch(logMessage(conversation));
    },
  });

  useQuery(P2P_COMM_INSTANCES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: ({ getP2PCommInstances }) => {
      const instances: Array<P2PInstance> = getP2PCommInstances.map(
        (i: any) => ({
          id: i.id,
          members: {
            me: {
              id: i.members.me.id,
              username: i.members.me.username,
            },
            conversant: {
              id: i.members.conversant.id,
              username: i.members.conversant.username,
            },
          },
        })
      );
      setP2PInstances(instances);
      instances.forEach((instance) => {
        getConversationFromIds({
          variables: {
            members: {
              myId: instance.members.me.id,
              conversantId: instance.members.conversant.id,
            },
            properties: {
              id: instance.id,
              creator: null,
              conversant: null,
            },
          },
        });
      });
    },
    onError: error => {},
  });

  const [getUsernameAndLog] = useLazyQuery(USERNAME, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      // most likely latestMsg will be empty here.
      const newMsg: Message = {
        sender: data.username,
        payload: latestMsg.payload,
        createdAt: latestMsg.createdAt,
      }
      // console.log(conv);
      console.log(newMsg);
      const conversation: Conversation = {
        name: data.username,
        // this could go wrong. latestMsg will always not be the address of the sender.
        address: latestMsg.author,
        instanceId: "",
        messages: [newMsg],
      };
      dispatch(logMessage(conversation));
    }
  });


  const [getConversationOnJoin] = useLazyQuery(CONVERSATION_FROM_ID, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const conversationData = data?.getConversationFromId;
      let conversation: Conversation;
      const conversantName = conversationData.name;
      if (conversationData?.messages?.length) {
        const transformedMessages: Array<Message> = conversationData?.messages?.map(
          (message: any): Message => {
            return {
              sender: message.authorUsername,
              payload: message.payload,
              createdAt: message.timestamp,
            };
          }
        );
        conversation = {
          name: conversantName,
          address: conversationData.address,
          messages: transformedMessages,
          instanceId: "",
        };
        dispatch(logMessage(conversation));
      } else {
        conversation = {
          name: conversantName,
          address: conversationData.address,
          instanceId: conversationData.instanceId,
          messages: [],
        };
        dispatch(logMessage(conversation));
      }
    },
  });

  const findConversantAddr = (addresses: Array<string>): string => 
    addresses.every(addr => id === addr) ? addresses[0] : addresses.find(addr => addr !== id)!;

  const [initializeP2PDNA] = useMutation(INITIALIZE_P2P_DNA, {
    onCompleted: (data) => {
      getConversationOnJoin({
        variables: {
          author: data.initializeP2PDNA.conversant,
          properties: {
            id: data.initializeP2PDNA.id,
            creator: data.initializeP2PDNA.creator,
            conversant: data.initializeP2PDNA.conversant,
          },
        },
      });
    },
  });

  // for p2pcommDNA request_to_chat that was sent when the
  // agent was offline 
  const [fetchRequestAndJoinP2PComm] = useMutation(FETCH_REQUEST_AND_JOIN_P2P_COMM, {
    onCompleted: (data) => {
      console.log(data);
      const instances: Array<P2PInstance> = data.joinP2PCommOnRequest ? data.joinP2PCommOnRequest.map((i: any) => {
        return {
          id: i.id,
          members: {
            me: {
              id: i.members.me.id,
              username: i.members.me.username,
            },
            conversant: {
              id: i.members.conversant.id,
              username: i.members.conversant.username
            }
          }
        }
      }): null;
      if (instances) instances.forEach(instance => {
        getConversationOnJoin({
          variables : {
            author: instance.members.conversant.id,
            properties: {
              id: instance.id,
              creator: instance.members.conversant.id,
              conversant: instance.members.me.id,
            }
          }
        });
      })
    }
  });

  const resolveSignal = async (sig: any) => {
    const { signal = null } = { ...sig };
    if (signal) {
      const parsedArgs = JSON.parse(signal.arguments);
      switch (signal.name) {
        case "request_received":
          const conversantAddr = findConversantAddr(
            parsedArgs.addresses.members
          );
          // temporary fix for the bug where id is undefined
          const myAddr = id ? id : localStorage.getItem("agent_address");
          console.log(myAddr);
          if (parsedArgs.in_contacts) {
            await initializeP2PDNA({
              variables: {
                properties: {
                  creator: conversantAddr,
                  conversant: myAddr,
                },
              },
            });
          } else {
            // needs to have 2 separate lists for in_contacts chat
            await initializeP2PDNA({
              variables: {
                properties: {
                  creator: conversantAddr,
                  conversant: myAddr,
                },
              },
            });
          }
          break;
        case "contact_checking_zome_interal_failed":
          break;
        case "contacts_checking_parsing_failed":
          break;
        case "contacts_checking_call_failed":
          break;
        case "message_sent":
          break;
        case "message_received":
          // get username from contacts.
          const conversantName: Profile = dispatch(
            getUsername(parsedArgs.payload.author) as any
          );

          // if not in contacts
          if (!conversantName) {
            const newMessage = {
              payload: parsedArgs.payload.message,
              createdAt: parsedArgs.payload.timestamp,
              author: parsedArgs.payload.author,
            };
            setLatestMsg(newMessage);
            getUsernameAndLog({
              variables: {
                address: parsedArgs.payload.recipient,
              },
            });
          }
          // TODO: cache the recent message
          const newMessage: Message = {
            sender: conversantName.username,
            payload: parsedArgs.payload.message,
            createdAt: parsedArgs.payload.timestamp,
          };
          const members: Members = {
            me: {
              id: parsedArgs.payload.recipient,
            },
            conversant: {
              id:  parsedArgs.payload.author,
            }
          };
          console.log(P2PInstances);
          // bug: p2pinstances are undefined.
          const thisInstance = P2PInstances.find(
            instance => instance.members.me.id === members.me.id
            && instance.members.conversant.id === members.conversant.id
          );
          console.log(thisInstance);
          const conversation: Conversation = {
            name: conversantName.username,
            address: parsedArgs.payload.author,
            messages: [newMessage],
            instanceId: "",
          };
          dispatch(logMessage(conversation));
          break;
        case "send_message_recipient_offline":
          break;
      }
    }
  };

  // this stops when initializeP2PDNA is called
  useEffect(() => {
    onSignal(resolveSignal);
  }, []);

  useEffect(() => {
    fetchRequestAndJoinP2PComm();
  }, []);

  return <>{children}</>;
};

export default P2PContainer;
