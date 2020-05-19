import {
  IonContent,
  IonItem,
  IonLabel,
  IonList,
  IonMenu,
  IonButton,
  IonNote,
} from "@ionic/react";
import React from "react";
import MenuHeader from "./MenuHeader";
import styles from "./style.module.css";
import { useHistory } from "react-router-dom";

/**
 * @name Menu
 *
 * Drawer of the application
 *
 * MenuHeader - The profile header found within the drawer
 *
 */

const Menu: React.FC = () => {
  const menuRef = React.useRef<any>(null);
  const history = useHistory();

  return (
    <IonMenu ref={menuRef} type="overlay" contentId="content">
      <IonContent>
        <MenuHeader history={history} close={() => menuRef.current?.close()} />
        <IonContent>
          <IonList className="ion-no-padding">
            <div
              onClick={() => {
                menuRef.current?.close();
                history.push("/blocked");
              }}
              className={`${styles.enablePointer} ${styles.item} ion-padding`}
            >
              <IonNote>Blocked</IonNote>
            </div>
          </IonList>
        </IonContent>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
