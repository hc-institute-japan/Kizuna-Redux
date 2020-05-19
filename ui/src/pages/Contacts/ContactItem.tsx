import React from "react";
import { IonItem, IonButton, IonLabel, IonIcon } from "@ionic/react";
import { sync } from "ionicons/icons";

const ContactItem: any = ({ contact }: { contact: any }) => (
  <IonItem>
    <IonLabel>{contact.username}</IonLabel>
    <IonButton onClick={() => {}} fill="clear" color="dark" slot="end">
      <IonIcon icon={sync} slot="end" />
    </IonButton>
  </IonItem>
);

export default ContactItem;
