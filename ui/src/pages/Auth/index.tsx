import { IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";

/**
 * @name Auth
 *
 * Handles the authentication of the application. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 */

const Auth: React.FC = () => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  useEffect(() => {}, []);

  return (
    <IonRouterOutlet>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </IonRouterOutlet>
  );
};

export default Auth;
