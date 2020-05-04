import { IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { authenticate } from "../../redux/auth/actions";

/**
 * @name Auth
 *
 * Handles the authentication of the application. Checks if there is an agent_address stored locally in the device's local storage. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 *
 *
 */

const Auth: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const address = localStorage.getItem("agent_address");
    if (address) dispatch(authenticate(address));
  }, [dispatch]);

  return (
    <IonRouterOutlet id="content">
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </IonRouterOutlet>
  );
};

export default Auth;
