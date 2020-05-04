import {
  IonButton,
  IonIcon,
  IonPopover,
  IonList,
  IonItem,
  IonToolbar,
  IonButtons,
} from "@ionic/react";
import { arrowBack, ellipsisVertical } from "ionicons/icons";
import React, { useRef, useState } from "react";
import styles from "./style.module.css";
import Popover from "../../components/Popover";

const ProfileHeader = ({ url }: { url: string }) => {
  const [showPopover, setIsPopoverVisible] = useState(false);
  const popover = useRef<any>(null);

  return (
    <div className={styles.profile} style={{ backgroundImage: `url(${url})` }}>
      <IonToolbar>
        <IonButtons>
          <IonButton>
            <IonIcon icon={arrowBack} />
          </IonButton>
        </IonButtons>
        <IonButtons slot="end">
          <IonButton
            onClick={(e) => {
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
        </IonList>
      </Popover>
    </div>
  );
};

export default ProfileHeader;
