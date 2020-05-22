import React, { useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Home from "../pages/Home";
import Menu from "../components/Menu";
import Profile from "../pages/Profile";
import EditProfile from "../pages/EditProfile";
import DeleteProfile from "../pages/DeleteProfile";
import { useQuery } from "@apollo/react-hooks";
import ME from "../graphql/query/meQuery";
import { useDispatch } from "react-redux";
import { setProfile } from "../redux/profile/actions";
import Blocked from "../pages/Contacts/Blocked";
import Add from "../pages/Add";

const Authenticated = () => {
  const profile = useQuery(ME);
  const dispatch = useDispatch();

  useEffect(() => {
    const me = { ...profile?.data?.me };
    if (Object.prototype.hasOwnProperty.call(me, "id")) {
      dispatch(setProfile(me));
    }
  }, [profile]);
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
        <Redirect from="*" to="/home" />
      </Switch>
    </>
  ) : null;
};

export default Authenticated;
