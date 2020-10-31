import React from "react";
import { Redirect, Route } from "react-router-dom";
import HomeTabBar from "../../components/Tab/HomeTabBar";
import Contacts from "../Contacts";
import Conversations from "../Conversations";

const Home: React.FC = () => (
  <HomeTabBar>
    <Route path="/home/messages" exact>
      <Conversations />
    </Route>
    <Route path="/home/contacts" exact>
      <Contacts />
    </Route>
    <Redirect from="/home*" to="/home/messages" />
  </HomeTabBar>
);

export default Home;
