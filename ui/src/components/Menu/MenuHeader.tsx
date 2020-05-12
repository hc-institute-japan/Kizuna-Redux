import {
  IonAvatar,
  IonCol,
  IonGrid,
  IonNote,
  IonRow,
  IonText,
} from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import styles from "./style.module.css";
import { withRouter } from "react-router-dom";

const MenuHeader = ({ history, close }: any) => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleOnClick = () => {
    close();
    history.push("/profile");
  };
  return (
    <div
      onClick={handleOnClick}
      className={`${styles.profile} ion-padding ion-activatable`}
    >
      <IonGrid>
        {/* <IonRow>
          <IonCol>
            <IonAvatar>
              <img src={profile.profilePicture}></img>
            </IonAvatar>
          </IonCol>
        </IonRow> */}

        <IonText color="dark">
          <h3>{`${profile.username}`}</h3>
        </IonText>
      </IonGrid>
    </div>
  );
};

export default withRouter(MenuHeader);
