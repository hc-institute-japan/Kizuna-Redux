import { IonContent, IonMenu, IonButton } from "@ionic/react";
import React from "react";
import MenuHeader from "./MenuHeader";

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

  return (
    <IonMenu ref={menuRef} type="overlay" contentId="content">
      <IonContent>
        <MenuHeader close={() => menuRef.current?.close()} />
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
