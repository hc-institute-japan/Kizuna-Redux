import React, { useEffect, createRef, useRef } from "react";
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import SearchHeader from "../../../components/Header/SearchHeader";
interface Props {
  hideSearch(): void;
  setSearch(value: string): void;
  search: string;
}
const Searching: React.FC<Props> = ({ hideSearch, search, setSearch }) => (
  <SearchHeader
    onSearchChange={(e) => setSearch((e.target as HTMLInputElement).value)}
    value={search}
    placeholder="Search Contacts"
  />
);

export default Searching;
