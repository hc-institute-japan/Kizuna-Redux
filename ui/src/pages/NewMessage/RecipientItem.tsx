import { useHistory } from "react-router-dom";
import { IonAvatar, IonItem, IonLabel } from "@ionic/react";
import React from "react";
import withToast, { ToastProps } from "../../components/Toast/withToast";
import { Profile } from "../../utils/types";

interface Props extends ToastProps {
  contact: Profile;
}

const RecipientItem: React.FC<Props> = ({ contact, pushErr }) => {
  const history = useHistory();

  return (
    <IonItem
      button
      onClick={() => history.push(`/chat-room/${contact.username}`, {})}
    >
      <IonAvatar slot="start">
        <img
          src="https://gravatar.com/avatar/dba6bae8c566f9d4041fb9cd9ada7741?d=identicon&f=y"
          alt=""
        />
      </IonAvatar>
      <IonLabel>{contact.username}</IonLabel>
    </IonItem>
  );
};

export default withToast(RecipientItem);
