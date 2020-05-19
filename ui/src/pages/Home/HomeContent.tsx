import { IonContent } from "@ionic/react";
import React from "react";
import Contacts from "../Contacts";
import HomeHeader from "../../components/Header/HomeHeader";

interface Props {
  tab: number;
}

const HomeContent: React.FC<Props> = ({ tab }) =>
  tab === 0 ? <HomeHeader /> : <Contacts />;

export default HomeContent;
