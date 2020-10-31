import { useQuery } from "@apollo/react-hooks";
import { IonLoading, IonRouterOutlet } from "@ionic/react";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import ME from "../../graphql/query/meQuery";
import { authenticate } from "../../redux/auth/actions";
import { RootState } from "../../redux/reducers";
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";
import P2PContainer from "../../containers/P2PContainer";

/**
 *
 *
 * @file Handles the authentication of the application. Checks if there is an agent_address stored locally in the device's local storage. Passes different set of routes depending on the authentication
 * Route - maps the necessary components to a certain url.
 */

const Auth: React.FC<ToastProps> = ({ pushErr }) => {
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  const { loading } = useQuery(ME, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    onError: (err) => pushErr(err, {}, "profiles"),
    onCompleted: (data) => dispatch(authenticate(data.me)),
  });

  return !loading ? (
    <IonRouterOutlet>
      {isAuthenticated ? (
        <P2PContainer>
          <Authenticated />
        </P2PContainer>
      ) : (
        <Unauthenticated />
      )}
    </IonRouterOutlet>
  ) : (
    <IonLoading isOpen={loading} message="Please wait..." />
  );
};

export default withToast(Auth);
