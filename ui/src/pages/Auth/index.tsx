import { useQuery } from "@apollo/react-hooks";
import { IonLoading, IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import ME from "../../graphql/query/meQuery";
import { authenticate } from "../../redux/auth/actions";
import { RootState } from "../../redux/reducers";
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";

/**
 * @name Auth
 *
 * Handles the authentication of the application. Checks if there is an agent_address stored locally in the device's local storage. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 *
 *
 */

const Auth: React.FC = () => {
  // right now, once authenticated, the user will always be authenticated. is this ok?
  // may need to deauthenticate once the user has no username already.
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  // this query is being called even before the holochain connection is finished establishing.
  // needs error handling
  const { loading, data } = useQuery(ME);

  // localStorage.removeItem("agent_address");
  // localStorage.setItem(
  //   "agent_address",
  //   "HcScjN8wBwrn3tuyg89aab3a69xsIgdzmX5P9537BqQZ5A7TEZu7qCY4Xzzjhma"
  // );
  useEffect(() => {
    const address = localStorage.getItem("agent_address");
    if (address && data?.me?.username !== null) {
      dispatch(authenticate(address));
    }
  }, [dispatch, data]);

  return !loading ? (
    <IonRouterOutlet>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </IonRouterOutlet>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
};

export default Auth;
