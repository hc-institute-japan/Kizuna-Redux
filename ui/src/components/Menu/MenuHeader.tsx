import { IonHeader, IonTitle, IonToolbar } from "@ionic/react";
import React from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../redux/reducers";
import styles from "./style.module.css";

interface Props {
  history: {
    push(param: string): void;
  };
  close(): void;
}

const MenuHeader: React.FC<Props> = ({ history, close }) => {
  const profile = useSelector((state: RootState) => state.profile.profile);

  const handleOnClick = () => {
    close();
    history.push("/profile");
  };

  return (
    <IonHeader
      role="banner"
      className="ios header-ios header-collapse-none hydrated"
    >
      <IonToolbar
        onClick={handleOnClick}
        className={`in-toolbar ios toolbar-title-default hydrated ${styles.profile}`}
      >
        <IonTitle className="ios title-default hydrated">
          {profile.username}
        </IonTitle>
      </IonToolbar>
    </IonHeader>
  );
};
// <div onClick={handleOnClick} className={`${styles.profile} ion-padding`}>
//   <IonText color="dark">
//     <h3 className="ion-no-margin">{`${profile.username}`}</h3>
//   </IonText>
// </div>

export default MenuHeader;
