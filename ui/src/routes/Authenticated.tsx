import { useLazyQuery } from "@apollo/react-hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Menu from "../components/Menu";
import withToast, { ToastProps } from "../components/Toast/withToast";
import INITIALIZE from "../graphql/messages/mutations/initializeP2PDNA";
import GET_MESSAGE from "../graphql/messages/query/getMessages";
import ME from "../graphql/query/meQuery";
import Add from "../pages/Add";
import ChatRoom from "../pages/ChatRoom";
import Blocked from "../pages/Contacts/Blocked";
import DeleteProfile from "../pages/DeleteProfile";
import EditProfile from "../pages/EditProfile";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import { setProfile } from "../redux/profile/actions";

const Authenticated: React.FC<ToastProps> = ({ pushErr }) => {
  const [
    getMe,
    { loading: meLoading, error: meError, data: me },
  ] = useLazyQuery(ME);
  const dispatch = useDispatch();
  useEffect(() => {
    getMe();
    if (me) {
      dispatch(setProfile(me.me));
    }
  }, [dispatch, me, getMe]);

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
