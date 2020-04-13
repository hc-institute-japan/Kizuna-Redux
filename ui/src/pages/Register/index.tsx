import { useMutation } from "@apollo/react-hooks";
import {
  IonButton,
  IonCol,
  IonContent,
  IonInput,
  IonLabel,
  IonRow,
} from "@ionic/react";
import React, { useState } from "react";
import { withRouter } from "react-router-dom";
import CREATE_PROFILE_MUTATION from "../../graphql/mutation/createProfileMutation";
import styles from "./style.module.css";

const Register = (
  props: any
  // props: RouteComponentProps<
  //   {
  //     setIsLogged(params: boolean): void;
  //   },
  //   any,
  //   { email: string } | any
) => {
  const [lastName, setLastName] = useState("");
  const [firstName, setFirstName] = useState("");
  const { email } = props.location.state;
  const [isInputValid, setIsInputValid] = useState(false);
  const [createProfile] = useMutation(CREATE_PROFILE_MUTATION);

  const onSubmitAction = () => {
    createProfile({
      variables: {
        profileInput: {
          first_name: firstName,
          last_name: lastName,
          email,
        },
      },
    }).then((returnEntry) => {
      localStorage.setItem("user_address", returnEntry.data.createProfile);

      props.setIsLogged(true);
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
          className={`${styles.RegisterInput} ion-justify-content-center`}
        >
          <IonCol>
            <IonInput
              type="text"
              value={firstName}
              onIonChange={(e) => {
                setFirstName((e.target as HTMLInputElement).value);
                if ((e.target as HTMLInputElement).value.length > 0)
                  setIsInputValid(true);
              }}
              placeholder="John"
            ></IonInput>
          </IonCol>
        </IonRow>
        <IonLabel className="ion-padding-top">
          <h2>Last Name</h2>
        </IonLabel>
        <IonRow
          className={`${styles.RegisterInput} ion-justify-content-center`}
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
        <IonButton
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
