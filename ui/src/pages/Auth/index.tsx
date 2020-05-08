import { IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import { useQuery } from '@apollo/react-hooks';
import ME from '../../graphql/query/meQuery';
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../redux/reducers";
import { authenticate } from "../../redux/auth/actions";

/**
 * @name Auth
 *
 * Handles the authentication of the application. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 */

const Auth: React.FC = () => {
  const meQuery = useQuery(ME);

  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const dispatch = useDispatch();

  useEffect(() => {
    const address = localStorage.getItem("agent_address");
    // TODO: may need refactoring for better error handling
    if (address && meQuery.data?.me?.username) dispatch(authenticate(address));
  }, [dispatch]);

  return (
    <IonRouterOutlet>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </IonRouterOutlet>
  );
};

export default Auth;
