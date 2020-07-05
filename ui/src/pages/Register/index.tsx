import { useMutation } from "@apollo/react-hooks";
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
import { withRouter, RouteComponentProps } from "react-router-dom";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import CREATE_PROFILE_MUTATION from "../../graphql/mutation/createProfileMutation";
import { authenticate } from "../../redux/auth/actions";
import { isUsernameFormatValid } from "../../utils/helpers/regex";
import styles from "./style.module.css";

interface Props extends ToastProps, RouteComponentProps {}

const Register: React.FC<Props> = (props) => {
  const [username, setUsername] = useState("");

  const [usernameError, setUsernameError] = useState("");
  const [isInputValid, setIsInputValid] = useState(false);
  const dispatch = useDispatch();
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION);

  useEffect(() => {
    setIsInputValid(
      isUsernameFormatValid(username) && username.trim().length > 0
    );
    if (username.length > 0) {
      // better regex handling
      setUsernameError(
        isUsernameFormatValid(username) ? "" : "Invalid username format"
      );
    }
  }, [username]);

  const onSubmitAction = async () => {
    // need to handle zomeapierror
    try {
      const profile_result = await createProfile({
        variables: { username },
      });
      // localStorage.setItem("user_address", returnEntry.data.createProfile);
      localStorage.setItem(
        "agent_address",
        profile_result.data.createProfile.id
      );
      dispatch(authenticate(profile_result.data.createProfile.id));
      props.history.push("/home");
      // catch the error from createZomeCall
    } catch (e) {
      props.pushErr(e, {}, "profiles");
    }
  };

  return (
    <IonContent>
      <div className={styles.Register}>
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
          Register
        </IonButton>
      </div>
    </IonContent>
  );
};

export default withToast(withRouter(Register));
