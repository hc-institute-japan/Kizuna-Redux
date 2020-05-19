import React from "react";
import {
  IonToolbar,
  IonButton,
  IonButtons,
  IonIcon,
  IonSearchbar,
} from "@ionic/react";
import { arrowBack } from "ionicons/icons";
import { withRouter, RouteComponentProps } from "react-router-dom";

interface Props {
  onBack?(): any;
  onSearchChange(e: any): any;
  value: string;
  placeholder?: string;
}

const SearchHeader: React.FC<Props & RouteComponentProps> = ({
  onBack = () => history.goBack(),
  onSearchChange,
  history,
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
