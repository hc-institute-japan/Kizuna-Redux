import { IonRouterOutlet, IonLoading } from "@ionic/react";
import React, { useState, useEffect } from "react";
import { useQuery } from "@apollo/react-hooks";
import ME from "../../graphql/query/meQuery";
import Authenticated from "../../routes/Authenticated";
import Unauthenticated from "../../routes/Unauthenticated";
import CREATE_PROFILE_MUTATION from "../../graphql/mutation/createProfile";
import { useMutation } from "@apollo/react-hooks";
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
  // right now, once authenticated, the user will always be authenticated. is this ok?
  // may need to deauthenticate once the user has no username already.
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );
  const dispatch = useDispatch();

  // this query is being called even before the holochain connection is finished establishing.
  // needs error handling
  const {loading, data} = useQuery(ME);

  // const [createProfile] = useMutation(CREATE_PROFILE_MUTATION);

  // useEffect(() => {
  //   createProfile({
  //     variables: {
  //       username: "j.cole",
  //     },
  //   });
  // }, []);

  useEffect(() => {
    console.log(data);
    const address = localStorage.getItem("agent_address");
    // localStorage.removeItem("agent_address");
    if (address && data?.me?.username !== null) {
      dispatch(authenticate(address));
    }
  }, [dispatch, data]);

  return !loading ? (
    <IonRouterOutlet>
      {isAuthenticated ? <Authenticated /> : <Unauthenticated />}
    </IonRouterOutlet>
  ) : (
    <IonLoading
    isOpen={loading}
    message={'Please wait...'}
  />
  );
};

export default Auth;
