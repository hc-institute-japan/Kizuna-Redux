import { useMutation, useQuery } from "@apollo/react-hooks";
import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
} from "@ionic/react";
import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CREATE_PRIVATE_PROFILE_MUTATION from "../../graphql/mutation/createPrivateProfileMutation";
import CREATE_PUBLIC_PROFILE_MUTATION from "../../graphql/mutation/createPublicProfileMutation";
import USERNAMES from "../../graphql/query/usernamesQuery";
import ADDRESS from "../../graphql/query/addressQuery";
import { authenticate } from "../../redux/auth/actions";
import { isUsernameFormatValid } from "../../utils/helpers/regex";
import styles from "./style.module.css";

type Props = RouteComponentProps<{}, {}, { email: string }>;

const Register: React.FC<Props> = (props) => {
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [firstName, setFirstName] = useState("");
  const { email } = props.location.state;
  const [isInputValid, setIsInputValid] = useState(false);
  const dispatch = useDispatch();
  const [createPrivateProfile] = useMutation(CREATE_PRIVATE_PROFILE_MUTATION);
  const [createPublicProfile] = useMutation(CREATE_PUBLIC_PROFILE_MUTATION);
  const { data } = useQuery(USERNAMES, {
    variables: {
      skip: username.length === 0,
      username,
    },
  });
  const addressQuery = useQuery(ADDRESS);

  useEffect(() => {
    setIsInputValid(
      isUsernameFormatValid(username) && username.trim().length > 0
    );
    if (username.length > 0) {
      setUsernameError(
        isUsernameFormatValid(username) ? "" : "Invalid username format"
      );
    }
  }, [username, firstName]);

  useEffect(() => {});

  const onSubmitAction = async () => {
    if (data?.usernames?.length === 0) {
      await createPrivateProfile({
        variables: {
          profile_input: {
            first_name: firstName,
            last_name: lastName,
            email,
          },
        },
      });
      // localStorage.setItem("user_address", returnEntry.data.createProfile);

      await createPublicProfile({
        variables: {
          profile_input: {
            username,
          },
        },
      });

      localStorage.setItem("agent_address", addressQuery.data.address);
      dispatch(authenticate(addressQuery.data.address));
      props.history.push("/home");
    } else {
      setUsernameError("Username already taken");
    }
  };
  return (
    <IonContent>
      <div className={styles.Register}>
        <IonLabel>
          <h2>First Name *</h2>
        </IonLabel>
        <IonRow
          className={`${styles.RegisterInput} ion-justify-content-center ion-margin-bottom`}
        >
          <IonCol>
            <IonInput
              type="text"
              value={firstName}
              onIonChange={(e) =>
                setFirstName((e.target as HTMLInputElement).value)
              }
              placeholder="John"
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonLabel>
          <h2>Last Name</h2>
        </IonLabel>
        <IonRow
          className={`${styles.RegisterInput} ion-justify-content-center ion-margin-bottom`}
        >
          <IonCol>
            <IonInput
              type="text"
              value={lastName}
              onIonChange={(e) =>
                setLastName((e.target as HTMLInputElement).value)
              }
              placeholder="Doe"
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonLabel>
          <h2>Username *</h2>
        </IonLabel>
        <IonRow
          className={`${styles.RegisterInput} ion-justify-content-center`}
        >
          <IonCol>
            <IonInput
              type="text"
              value={username}
              onIonChange={(e) =>
                setUsername((e.target as HTMLInputElement).value)
              }
              placeholder="john_doe"
            ></IonInput>
          </IonCol>
        </IonRow>
        {usernameError.length > 0 ? (
          <IonRow className="ion-padding-start ion-align-self-start">
            <IonLabel color="danger">
              <p>{usernameError}</p>
            </IonLabel>
          </IonRow>
        ) : null}

        <IonButton
          color="primary"
          onClick={onSubmitAction}
          disabled={!isInputValid}
          className={styles.Next}
        >
          Next
        </IonButton>
      </div>
    </IonContent>
  );
};

export default withRouter(Register);
