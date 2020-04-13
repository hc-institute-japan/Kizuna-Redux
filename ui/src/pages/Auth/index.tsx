import { IonRouterOutlet } from "@ionic/react";
import React, { useState } from "react";
import Authenticated from "./routes/Authenticated";
import Unauthenticated from "./routes/Unauthenticated";

/**
 * @name Auth
 *
 * Handles the authentication of the application. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 */

const Auth: React.FC = () => {
  const [isLogged, setIsLogged] = useState<boolean | false>(false);

  return (
    <IonRouterOutlet>
      {isLogged ? (
        <Authenticated />
      ) : (
        <Unauthenticated setIsLogged={setIsLogged} />
      )}
    </IonRouterOutlet>
  );
};

export default Auth;
