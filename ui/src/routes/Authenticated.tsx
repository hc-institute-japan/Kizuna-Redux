import { useQuery } from "@apollo/react-hooks";
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { Redirect, Route, Switch } from "react-router-dom";
import Menu from "../components/Menu";
import withToast from "../components/Toast/withToast";
import ME from "../graphql/query/meQuery";
import Add from "../pages/Add";
import Blocked from "../pages/Contacts/Blocked";
import DeleteProfile from "../pages/DeleteProfile";
import EditProfile from "../pages/EditProfile";
import Home from "../pages/Home";
import Profile from "../pages/Profile";
import ChatRoom from "../pages/ChatRoom";
import NewMessage from "../pages/NewMessage";
import { setProfile } from "../redux/profile/actions";

const Authenticated: React.FC = ({ pushErr }: any) => {
  const profile = useQuery(ME);
  const dispatch = useDispatch();

  useEffect(() => {
    const me = { ...profile?.data?.me };
    if (Object.prototype.hasOwnProperty.call(me, "id")) {
      dispatch(setProfile(me));
    }
  }, [profile, dispatch]);

  useEffect(() => {
    if (profile.error) pushErr(profile.error, {}, "profiles");
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile.error]);
  return !profile.loading ? (
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
        <Route path="/new-message" exact>
          <NewMessage />
        </Route>
        <Redirect from="*" to="/home" />
      </Switch>
    </>
  ) : null;
};

export default withToast(Authenticated);
