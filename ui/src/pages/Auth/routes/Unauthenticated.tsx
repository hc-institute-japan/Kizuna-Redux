import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import Complete from "../../Complete";
import Landing from "../../Landing";
import Login from "../../Login";
import Register from "../../Register";

/**
 * @name Unauthenticated
 *
 * These are available routes when the user is not yet logged in/authenticated. It basically contains two paths which is:
 * Landing - page wherein kizuna logo and the login button are shown
 * Login - page where the user will login (or register if they dont have an account yet)
 *
 * The Redirect part means that any url aside from those two registered will be redirected to '/' path or the Landing page
 */

type Props = {
  setIsLogged(param: boolean): void;
};

const Unauthenticated: React.FC<Props> = ({ setIsLogged }) => (
  <Switch>
    <Route path="/" exact>
      <Landing />
    </Route>
    <Route path="/login" exact>
      <Login />
    </Route>
    <Route path="/register" exact>
      <Register setIsLogged={setIsLogged} />
    </Route>
    <Route path="/complete" exact>
      <Complete />
    </Route>
    <Redirect to="/" />
  </Switch>
);

export default Unauthenticated;
