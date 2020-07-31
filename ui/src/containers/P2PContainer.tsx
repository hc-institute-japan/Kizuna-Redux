import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { onSignal } from "../connection/holochainClient";
import INITIALIZE_P2P_DNA from "../graphql/messages/mutations/initializeP2PDNAMutation";
import CONVERSATION_FROM_ID from "../graphql/messages/query/getConversationFromIdQuery";
import CONVERSATION_FROM_IDS from "../graphql/messages/query/getConversationFromIdsQuery";
import P2P_COMM_INSTANCES from "../graphql/messages/query/getP2PCommInstancesQuery";
import USERNAME from "../graphql/query/usernameQuery";
import { getUsername } from "../redux/contacts/actions";
import { logMessage } from "../redux/conversations/actions";
import { RootState } from "../redux/reducers";
import { Conversation, Message, P2PInstance } from "../utils/types";

/**
 *
 * @file Contains the p2p implementation used within the app
 *
 */

const P2PContainer: React.FC = ({ children }) => {
  const dispatch = useDispatch();
  const {
    profile: { id },
  } = useSelector((state: RootState) => state.profile);

  const [conversant, setConversant] = useState("");

  const [latestMsg, setLatestMsg] = useState({
    payload: "",
    createdAt: 0,
  });

  const [P2PInstances, setP2PInstances] = useState<Array<P2PInstance>>([]);

  const [getConversationFromIds] = useLazyQuery(CONVERSATION_FROM_IDS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      const conversationData = data.getConversationFromIds;

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
        instanceId: "",
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
  });

  const [getUsernameAndLog] = useLazyQuery(USERNAME, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newMsg: Message = {
        sender: data.username,
        payload: latestMsg.payload,
        createdAt: latestMsg.createdAt,
      };

      const conversation: Conversation = {
        name: data.username,
        address: conversant,
        messages: [newMsg],
        instanceId: "",
      };
      dispatch(logMessage(conversation));
    },
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
          messages: [],
          instanceId: "",
        };
        dispatch(logMessage(conversation));
      }
    },
  });

  const findConversantAddr = (addresses: Array<string>): string =>
    addresses.find((addr) => addr !== id) || "";

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

  const resolveSignal = async (sig: any) => {
    const { signal = null } = { ...sig };
    if (signal) {
      const parsedArgs = JSON.parse(signal.arguments);
      switch (signal.name) {
        case "request_received":
          const conversantAddr = findConversantAddr(
            parsedArgs.addresses.members
          );
          setConversant(conversantAddr);

          if (parsedArgs.in_contacts) {
            await initializeP2PDNA({
              variables: {
                properties: {
                  creator: conversantAddr,
                  conversant: id,
                },
              },
            });
          } else {
            // needs to have 2 separate lists for in_contacts chat
            await initializeP2PDNA({
              variables: {
                properties: {
                  creator: conversantAddr,
                  conversant: id,
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
          const conversantName: string = dispatch(
            getUsername(parsedArgs.payload.author) as any
          );

          // if not in contacts
          if (!conversantName) {
            const newMessage = {
              payload: parsedArgs.payload.message,
              createdAt: parsedArgs.payload.timestamp,
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
            sender: conversantName,
            payload: parsedArgs.payload.message,
            createdAt: parsedArgs.payload.timestamp,
          };
          const conversation: Conversation = {
            name: conversantName,
            address: parsedArgs.payload.recipient,
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

  useEffect(() => {
    onSignal(resolveSignal);
  }, []);

  return <>{children}</>;
};

export default P2PContainer;
