import { useLazyQuery, useMutation } from "@apollo/react-hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Menu from "../components/Menu";
import withToast, { ToastProps } from "../components/Toast/withToast";
import ME from "../graphql/query/meQuery";
import Add from "../pages/Add";
import ChatRoom from "../pages/ChatRoom";
import Blocked from "../pages/Contacts/Blocked";
import DeleteProfile from "../pages/DeleteProfile";
import EditProfile from "../pages/EditProfile";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { onSignal } from "../connection/holochainClient";
import { setProfile } from "../redux/profile/actions";
import { logMessage } from "../redux/conversations/actions";
import { getUsername } from "../redux/contacts/actions";
import { Conversation } from "../utils/types/";
import INITIALIZE_P2P_DNA from "../graphql/messages/mutations/initializeP2PDNAMutation";
import MESSAGES from "../graphql/messages/query/getMessagesQuery";
import USERNAME from "../graphql/query/usernameQuery";

const Authenticated: React.FC<ToastProps> = ({ pushErr }) => {
  const [getMe, { loading: meLoading, error: meError, data: me }] = useLazyQuery(ME);
  const [getMsgs, {data: msgs}] = useLazyQuery(MESSAGES);
  const [getUsrname, {data}] = useLazyQuery(USERNAME);
  const [initializeP2PDNA] = useMutation(INITIALIZE_P2P_DNA);
  const dispatch = useDispatch();


  useEffect(() => {
    getMe();
    if (me) {
      dispatch(setProfile(me.me));
    }
  }, [dispatch, me, getMe]);

  const pickMyAddress = (addresses: Array<string>) => addresses.find(addr => addr === me.id);

  const resolveSignal = async (signal: any) => {
    let parsedArgs;
    if (signal?.signal?.arguments) parsedArgs = JSON.parse(signal?.signal?.arguments);
    switch(signal?.signal?.name) {
      case "request_receieved":
        // needs to have 2 separate lists for in_contacts chat
        if (parsedArgs.in_contacts) {
          const createP2PDNAResult = await initializeP2PDNA({
            variables : {
              requirements: {
                id: parsedArgs.addresses.members[0],
                recipient: parsedArgs.addresses.members[1],
              }
            }
          });
          if (createP2PDNAResult.data?.initializeP2PDNA) {
            // needs to cache recent messages
            getMsgs();
            console.log(msgs);
          }
        } else {
          const createP2PDNAResult = await initializeP2PDNA({
            variables : {
              requirements: {
                id: parsedArgs.addresses.members[0],
                recipient: parsedArgs.addresses.members[1],
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
        console.log("working?");
        console.log(parsedArgs);
        // call get username from address.
        const recipient: string = dispatch(getUsername(parsedArgs.payload.author) as any)
        if (!recipient) {
          getUsrname({
            variables : {
              address: parsedArgs.payload.recipient,
            }
          });
        }
        // TODO: cache the recent message in the future
        const newMessage = {
          sender: recipient,
          payload: parsedArgs.payload.message,
          createdAt: parsedArgs.payload.timestamp,
        };
        const conversation: Conversation = {
          name: recipient,
          address: parsedArgs.payload.recipient,
          messages: [newMessage], // this should be the result from sendMessage
        };
        dispatch(logMessage(conversation));
        break;
      case "send_message_recipient_offline":
        break;
    }
  }

  useEffect(() => {
    onSignal((signal: any) => resolveSignal(signal))
  }, [onSignal]);
  

  useEffect(() => {
    if (meError) pushErr(meError, {}, "profiles");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [meError]);
  return !meLoading ? (
    <>
      <Menu />
      <Switch>
        <Route path="/home">
          <Home />
        </Route>
        <Route path="/profile" exact>
          <Profile />
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
  ) : null;
};

export default withToast(Authenticated);
