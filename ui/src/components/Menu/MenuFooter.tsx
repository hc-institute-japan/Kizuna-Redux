import React from "react";
import { IonFooter, IonToolbar, IonTitle } from "@ionic/react";

const MenuFooter = () => {
  return (
    <IonFooter>
      <IonToolbar>
        <IonTitle>
          <h5 className="ion-no-margin">Logout</h5>
        </IonTitle>
      </IonToolbar>
    </IonFooter>
  );
};

export default MenuFooter;
