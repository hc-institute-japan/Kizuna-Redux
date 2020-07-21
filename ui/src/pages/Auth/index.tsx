import { useLazyQuery } from "@apollo/react-hooks";
import { IonLoading, IonRouterOutlet } from "@ionic/react";
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import withToast, { ToastProps } from "../../components/Toast/withToast";
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
 */

const Auth: React.FC<ToastProps> = ({ pushErr }) => {
  // right now, once authenticated, the user will always be authenticated. is this ok?
  // may need to deauthenticate once the user has no username already.
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const [getMe, { loading, error }] = useLazyQuery(ME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onCompleted: (data) => {
      // localStorage.removeItem("agent_address");
      const address = localStorage.getItem("agent_address");
      if (data?.me?.username) {
        if (address) {
          localStorage.setItem("agent_address", data?.me?.id);
          dispatch(authenticate(data.me));
        } else {
          localStorage.setItem("agent_address", data?.me?.id);
          dispatch(authenticate(data?.me?.id));
        }
      }
    },
  });

  useEffect(() => getMe(), [getMe]);

  // this can be done in onError instead
  useEffect(() => {
    if (error) pushErr(error, {}, "profiles");
  }, [error, pushErr]);

  return !loading ? (
    <IonRouterOutlet>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
      {/* <Toast /> */}
    </IonRouterOutlet>
  ) : (
    <IonLoading isOpen={loading} message={"Please wait..."} />
  );
};

export default withToast(Auth);
