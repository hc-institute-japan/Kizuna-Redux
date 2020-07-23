import { useLazyQuery, useMutation, useQuery } from "@apollo/react-hooks";
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Menu from "../components/Menu";
import withToast, { ToastProps } from "../components/Toast/withToast";
import Add from "../pages/Add";
import ChatRoom from "../pages/ChatRoom";
import Blocked from "../pages/Contacts/Blocked";
import DeleteProfile from "../pages/DeleteProfile";
import EditProfile from "../pages/EditProfile";
import Home from "../pages/Home";
import ProfilePage from "../pages/Profile";
import { onSignal } from "../connection/holochainClient";
import { logMessage } from "../redux/conversations/actions";
import { getUsername } from "../redux/contacts/actions";
import INITIALIZE_P2P_DNA from "../graphql/messages/mutations/initializeP2PDNAMutation";
import CONVERSATION_FROM_ID from "../graphql/messages/query/getConversationFromIdQuery";
import CONVERSATION_FROM_IDS from "../graphql/messages/query/getConversationFromIdsQuery";
import P2P_COMM_INSTANCES from "../graphql/messages/query/getP2PCommInstancesQuery";
import CONTACTS from "../graphql/query/listContactsQuery";
import { setContacts } from "../redux/contacts/actions";
import USERNAME from "../graphql/query/usernameQuery";
import { Message, Conversation, P2PInstance, Profile } from "../utils/types";
import { RootState } from "../redux/reducers";

const Authenticated: React.FC<ToastProps> = ({ pushErr }) => {
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
      pushErr(error, {}, "contacts");
    },
  });

  const dispatch = useDispatch();
  const { profile: { id: myAddr } } = useSelector((state: RootState) => state.profile);

  const [latestMsg, setLatestMsg] = useState({
    payload: "",
    createdAt: 0,
    author: "",
  });

  useEffect(() => {
    console.log(myAddr);
  }, [myAddr]);

  const [P2PInstances, setP2PInstances] = useState<Array<P2PInstance>>([]);

  const [getConversationFromIds] = useLazyQuery(CONVERSATION_FROM_IDS, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: data => {
      const conversationData = data?.getConversationFromIds;
      console.log(data);
      console.log(P2PInstances);
      const messages = data.getConversationFromIds.messages;
      const transformedMessages: Array<Message> = messages.map((message: any): Message => {
        return {
          sender: message.authorUsername,
          payload: message.payload,
          createdAt: message.timestamp,
        }
      });
      const conversation: Conversation = {
        name: conversationData.name,
        address: conversationData.address,
        instanceId: data?.getConversationFromIds.instanceId,
        messages: transformedMessages,
      };
      dispatch(logMessage(conversation));
    },
  })

  const [getP2PCommInstances] = useLazyQuery(P2P_COMM_INSTANCES, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: data => {
      const instances: Array<P2PInstance> = data.getP2PCommInstances.map((i: any) => {
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
      })
      setP2PInstances(instances);
      instances.forEach(instance => {
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
            }
          }
        });
      })
    },
  })

  const [getUsernameAndLog] = useLazyQuery(USERNAME, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: data => {
      const newMsg: Message = {
        sender: data.username,
        payload: latestMsg.payload,
        createdAt: latestMsg.createdAt,
      }
      // console.log(conv);
      console.log(newMsg);
      const conversation: Conversation = {
        name: data.username,
        // this is wrong. conversant will always not be the address of the sender.
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
    onCompleted: data => {
      const conversationData = data?.getConversationFromId;
      let conversation: Conversation;
      const conversantName = conversationData.name;
      if (conversationData?.messages?.length) {
        const transformedMessages: Array<Message> = conversationData?.messages?.map((message: any): Message => {
          return {
            sender: message.authorUsername,
            payload: message.payload,
            createdAt: message.timestamp,
          }
        });
        conversation = {
          name: conversantName,
          address: conversationData.address,
          instanceId: conversationData.instanceId,
          messages: transformedMessages,
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

  const findConversantAddr = (addresses: Array<string>): string => {
    if (addresses[0] === myAddr && addresses[1] === myAddr) return addresses[0];
    console.log(myAddr);
    const conversantAddr = addresses.find(addr => addr !== myAddr);
    return conversantAddr!
  };
  
  const [initializeP2PDNA] = useMutation(INITIALIZE_P2P_DNA, {
    onCompleted: (data) => {
      console.log("on completed");
      getConversationOnJoin({
        variables : {
          author: data.initializeP2PDNA.conversant,
          properties: {
            id: data.initializeP2PDNA.id,
            creator: data.initializeP2PDNA.creator,
            conversant: data.initializeP2PDNA.conversant,
          }
        }
      });
    }
  });

  const resolveSignal = async (signal: any) => {
    console.log("signal_received");
    let parsedArgs;
    if (signal?.signal?.arguments) parsedArgs = JSON.parse(signal?.signal?.arguments);
    switch(signal?.signal?.name) {
      case "request_received":
        console.log(parsedArgs.addresses.members);
        const conversantAddr = findConversantAddr(parsedArgs.addresses.members);
        // setConv(conversantAddr);
        // console.log(conv);
        console.log(conversantAddr);
        console.log(myAddr);
        if (parsedArgs.in_contacts) {
          await initializeP2PDNA({
            variables : {
              properties: {
                creator: conversantAddr,
                conversant: myAddr,
              }
            }
          });
        } else {
          // needs to have 2 separate lists for in_contacts chat
          await initializeP2PDNA({
            variables : {
              properties: {
                creator: conversantAddr,
                conversant: myAddr,
              }
            }
          });
        };
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
        console.log(parsedArgs.payload.author);
        const conversantName: Profile = dispatch(getUsername(parsedArgs.payload.author) as any);
        console.log(conversantName);
        console.log(parsedArgs);
        // if not in contacts
        if (!conversantName) {
          // This is needs to be separated from the chat page we have now.
          console.log("hello?")
          const newMessage = {
            payload: parsedArgs.payload.message,
            createdAt: parsedArgs.payload.timestamp,
            author: parsedArgs.payload.author,
          };
          setLatestMsg(newMessage);
          getUsernameAndLog({
            variables : {
              address: parsedArgs.payload.recipient,
            }
          });
        }
        // TODO: cache the recent message
        const newMessage: Message = {
          sender: conversantName.username,
          payload: parsedArgs.payload.message,
          createdAt: parsedArgs.payload.timestamp,
        };
        const conversation: Conversation = {
          name: conversantName.username,
          address: parsedArgs.payload.recipient,
          instanceId: "",
          messages: [newMessage],
        };
        dispatch(logMessage(conversation));
        break;
      case "send_message_recipient_offline":
        break;
    }
  };

  useEffect(() => {
    onSignal((signal: any) => resolveSignal(signal))
  }, []);

  useEffect(() => {
    getP2PCommInstances();
  }, [])

  return (
    <>
      <Menu />
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/profile" exact>
          <ProfilePage />
        </Route>
        <Route path="/edit-profile" exact>
          <EditProfile />
        </Route>
        <Route path="/delete-profile" exact>
          <DeleteProfile />
        </Route>
        <Route path="/blocked" exact>
          <Blocked />
        </Route>
        <Route path="/add" exact>
          <Add />
        </Route>
        <Route path="/chat-room/:id" exact>
          <ChatRoom />
        </Route>
        <Redirect from="*" to="/home" />
      </Switch>
    </>
  );
};

export default withToast(Authenticated);
