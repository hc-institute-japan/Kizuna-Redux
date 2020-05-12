import React from "react";
import { Switch, Route } from "react-router-dom";
import Home from "../pages/Home";

const Authenticated = () => (
  <Switch>
    <Route path="/home" exact>
      <Home />
    </Route>
  </Switch>
);

export default Authenticated;
