import {
  IonContent,
  IonList,
  IonMenu,
  IonNote,
  IonFooter,
  IonToolbar,
  IonTitle,
} from "@ionic/react";
import React from "react";
import { useHistory } from "react-router-dom";
import MenuHeader from "./MenuHeader";
import styles from "./style.module.css";
import MenuFooter from "./MenuFooter";

/**
 * @name Menu
 *
 * Drawer of the application
 *
 * MenuHeader - The profile header found within the drawer
 *
 */

const Menu: React.FC = () => {
  const menuRef = React.useRef<HTMLIonMenuElement | null>(null);
  const history = useHistory();

  return (
    <IonMenu ref={menuRef} type="overlay" contentId="content">
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
      <MenuFooter />
    </IonMenu>
  );
};

export default Menu;
