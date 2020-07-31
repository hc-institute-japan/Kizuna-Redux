import React from "react";
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

/**
 *
 * @file Contains the routes for Authenticated users
 *
 */

const Authenticated: React.FC<ToastProps> = () => (
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

export default withToast(Authenticated);
