import {
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
  IonToolbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import React from "react";
import { RouteComponentProps, withRouter } from "react-router-dom";

interface Props {
  onBack?(): void;
  onSearchChange(e: CustomEvent): void;
  value: string;
  placeholder?: string;
}

const SearchHeader: React.FC<Props & RouteComponentProps> = ({
  onSearchChange,
  history,
  onBack = () => history.goBack(),
  value,
  placeholder = "",
}) => {
  return (
    <IonToolbar>
      <IonButtons slot="start">
        <IonButton onClick={onBack}>
          <IonIcon slot="icon-only" icon={arrowBack} />
        </IonButton>
      </IonButtons>
      <IonSearchbar
        onIonChange={onSearchChange}
        value={value}
        placeholder={placeholder}
      />
    </IonToolbar>
  );
};

export default withRouter(SearchHeader);
