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
import INITIALIZE_P2P_DNA from "../graphql/messages/mutations/initializeP2PDNAMutation";
import MESSAGES from "../graphql/messages/query/getMessagesQuery";

const Authenticated: React.FC<ToastProps> = ({ pushErr }) => {
  const [getMe, { loading: meLoading, error: meError, data: me }] = useLazyQuery(ME);
  const [getMsgs, {data: msgs}] = useLazyQuery(MESSAGES);
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
    const parsedArgs = JSON.parse(signal?.signal?.arguments);
    const parsedName = JSON.parse(signal?.signal?.name);
    switch(parsedArgs.code) {
      case "request_receieved":
        // needs to have 2 separate lists for in_contacts chat
        if (parsedArgs.in_contacts) {
          const createP2PDNAResult = await initializeP2PDNA({
            variables : {
              requirements: {
                id: parsedName.members[0],
                recipient: parsedName.members[1],
              }
            }
          });
          if (createP2PDNAResult.data?.initializeP2PDNA) {

          }
        } else {
          const createP2PDNAResult = await initializeP2PDNA({
            variables : {
              requirements: {
                id: parsedName.members[0],
                recipient: parsedName.members[1],
              }
            }
          });
        };
        break;
      case "parsing_failed":
        break;

        
    }
  }

  useEffect(() => {
    onSignal((signal: any) => {
      if (signal?.signal) {
        const parsedArgs = JSON.parse(signal?.signal?.arguments);
        const parsedName = JSON.parse(signal?.signal?.name);
        console.log(parsedArgs);
        console.log(parsedName);
      }
      console.log(signal);
    })
  }, []);

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
