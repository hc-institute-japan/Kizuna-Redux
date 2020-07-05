import {
  IonBackButton,
  IonButton,
  IonButtons,
  IonIcon,
  IonItem,
  IonList,
  IonToolbar,
} from "@ionic/react";
import { ellipsisVertical } from "ionicons/icons";
import React, { useRef } from "react";
import Popover from "../../components/Popover";
import styles from "./style.module.css";

const ProfileHeader = ({ url }: { url: string }) => {
  const popover = useRef<any>(null);
  return (
    <div className={styles.profile} style={{ backgroundImage: `url(${url})` }}>
      <IonToolbar>
        <IonButtons>
          <IonBackButton defaultHref="/home" />
          {/* <IonButton>
            <IonIcon icon={arrowBack} />
          </IonButton> */}
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            onClick={(
              e: React.MouseEvent<HTMLIonButtonElement, MouseEvent>
            ) => {
              popover?.current?.show(e);
            }}
          >
            <IonIcon icon={ellipsisVertical} />
          </IonButton>
        </IonButtons>
      </IonToolbar>
      <Popover ref={popover}>
        <IonList>
          <IonItem button href="/edit-profile">
            Edit profile
          </IonItem>
          <IonItem button href="/delete-profile">
            Delete profile
          </IonItem>
        </IonList>
      </Popover>
    </div>
  );
};

export default ProfileHeader;
