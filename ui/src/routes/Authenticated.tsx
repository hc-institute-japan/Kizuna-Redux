import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";
import Menu from "../components/Menu";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";

const Authenticated = () => (
  <>
    <Menu />

    <Switch>
      <Route path="/home" exact>
        <Home />
      </Route>
      <Route path="/profile" exact>
        <Profile />
      </Route>
      <Route path="/edit-profile" exact>
        <EditProfile />
      </Route>
    </Switch>
  </>
);

export default Authenticated;
