import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
} from "@ionic/react";
import React, { useState, useEffect } from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";
import CREATE_PROFILE_MUTATION from "../../graphql/mutation/createProfileMutation";
import styles from "./style.module.css";
import { useDispatch } from "react-redux";
import { authenticate } from "../../redux/auth/actions";
import { isUsernameFormatValid } from "../../utils/helpers/regex";

type Props = RouteComponentProps<{}, {}, { email: string }>;

const Register: React.FC<Props> = (props) => {
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [firstName, setFirstName] = useState("");
  const { email } = props.location.state;
  const [isInputValid, setIsInputValid] = useState(false);
  const dispatch = useDispatch();
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION);

  useEffect(() => {
    setIsInputValid(
      isUsernameFormatValid(username) && username.trim().length > 0
    );
  }, [username, firstName]);

  const onSubmitAction = () => {
    createProfile({
      variables: {
        profile_input: {
          first_name: firstName,
          last_name: lastName,
          email,
        },
      },
    }).then((_) => {
      // localStorage.setItem("user_address", returnEntry.data.createProfile);
      dispatch(authenticate());
      props.history.push("/home");
    });
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
          className={`${styles.RegisterInput} ion-justify-content-center ion-margin-bottom`}
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
