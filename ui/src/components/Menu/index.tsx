import { IonContent, IonMenu } from "@ionic/react";
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

const Menu: React.FC = () => (
  <IonMenu type="overlay" contentId="content">
    <IonContent>
      <MenuHeader />
    </IonContent>
  </IonMenu>
);

export default Menu;
