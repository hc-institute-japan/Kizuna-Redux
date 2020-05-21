import { IonGrid, IonText } from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import { withRouter } from "react-router-dom";
import { RootState } from "../../redux/reducers";
import styles from "./style.module.css";

const MenuHeader = ({ history, close }: any) => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleOnClick = () => {
    close();
    history.push("/profile");
  };
  return (
    <div onClick={handleOnClick} className={`${styles.profile} ion-padding`}>
      <IonGrid>
        <IonText color="dark">
          <h3>{`${profile.username}`}</h3>
        </IonText>
      </IonGrid>
    </div>
  );
};

export default MenuHeader;
