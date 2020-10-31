import { useMutation } from "@apollo/react-hooks";
import { IonContent, IonPage, IonText } from "@ionic/react";
import Moment from "moment";
import React, { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import ListItem from "../../components/Item";
import List, { ListRef } from "../../components/List";
import SEND_MESSAGE from "../../graphql/messages/mutations/sendMessageMutation";
import { logMessage } from "../../redux/conversations/actions";
import { RootState } from "../../redux/reducers";
import { Conversation, Message, Profile } from "../../utils/types";
import ChatEditFooter from "./ChatEditFooter";
import ChatFooter from "./ChatFooter";
import ChatHeader from "./ChatHeader";
import ChatMultiselectHeader from "./ChatMultiSelectHeader";
import styles from "./style.module.css";

interface LocationState {
  name: string;
  recipientAddr: string;
  instanceId: string;
}

const getProperTimestamp = (timestamp: number) =>
  Moment(new Date(timestamp).toLocaleString()).format("LT");

const ChatRoom: React.FC = () => {
  const [payload, setPayload] = useState<string>();
  const location = useLocation<LocationState>();
  const dispatch = useDispatch();
  const [isMultiselect, setIsMultiselect] = useState(false);
  const [toEdit, setToEdit] = useState<Message | null>(null);
  const [items, setItems] = useState<{ [id: string]: Message }>({});
  const list = useRef<ListRef>(null);
  const content = useRef<HTMLIonContentElement>(null);
  const { name: id, instanceId, recipientAddr } = location.state;
  const {
    profile: { username: me, id: myAddr },
  } = useSelector((state: RootState) => state.profile);

  const { conversation, isContact } = useSelector((state: RootState) => ({
    conversation: state.conversations.conversations.find(
      (conversation) => conversation.name === id
    ),
    isContact: state.contacts.contacts.some(
      (contact: Profile) => contact.id === recipientAddr
    ),
  }));

  const messages = conversation?.messages || [];

  const edit = (item: Message) => {
    setToEdit(item);
    setIsMultiselect(false);
    list?.current?.close();
  };

  const [sendMessage] = useMutation(SEND_MESSAGE, {
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      const newMessage = {
        sender: me,
        payload: data?.sendMessage?.payload,
        createdAt: data?.sendMessage?.timestamp * 1000,
        address: data?.sendMessage?.address,
      };
      const conversation: Conversation = {
        name: id!,
        address: recipientAddr,
        instanceId,
        messages: [newMessage], // this should be the result from sendMessage
      };
      // BUG: new message is only being rendered when I type a new message.
      dispatch(logMessage(conversation));
      scrollToBottom();
    },
  });

  const scrollToBottom = () => {
    content?.current?.scrollToBottom();
  };

  useEffect(scrollToBottom, [messages]);

  const sendNewMessage = async () => {
    await sendMessage({
      variables: {
        author: myAddr,
        recipient: recipientAddr,
        message: payload,
        properties: {
          id: instanceId,
          creator: null,
          conversant: null,
        },
      },
    });
    setPayload("");
  };

  return (
    <IonPage>
      {isMultiselect ? (
        <ChatMultiselectHeader
          items={items}
          edit={edit}
          instanceId={instanceId}
          list={list}
          conversation={conversation}
          me={me}
        />
      ) : (
        <ChatHeader name={id!} isContact={isContact} />
      )}
      <IonContent ref={content} scrollEvents={true}>
        <List
          ref={list}
          className={styles.list}
          isMultiselect={(bool: boolean) => setIsMultiselect(bool)}
          onClick={(i: number) => {}}
          onMultiselectClick={(i: number) =>
            setItems((curr) => {
              if (curr[messages[i].address]) delete curr[messages[i].address];
              else curr[messages[i].address] = messages[i];

              return { ...curr };
            })
          }
        >
          {messages
            ? messages.map((message: Message) =>
                message.sender === me ? (
                  // i % 2 === 1 ? (
                  <ListItem
                    lines="none"
                    color="none"
                    key={JSON.stringify(message)}
                    className={styles.me}
                  >
                    <div
                      className={`${styles["my-message"]} ${styles["message"]} ion-text-wrap`}
                    >
                      <IonText>
                        <p className="ion-text-start">{message.payload}</p>
                      </IonText>
                      <div className={`${styles["time"]}`}>
                        {getProperTimestamp(message.createdAt)}
                      </div>
                    </div>
                  </ListItem>
                ) : (
                  <ListItem
                    lines="none"
                    color="none"
                    key={JSON.stringify(message)}
                    className={styles.other}
                  >
                    <div
                      className={`${styles["other-message"]} ${styles["message"]} ion-text-wrap`}
                    >
                      <IonText>
                        <p>{message.payload}</p>
                      </IonText>
                      <div className={`${styles["time"]}`}>
                        {getProperTimestamp(message.createdAt)}
                      </div>
                    </div>
                  </ListItem>
                )
              )
            : null}
        </List>
      </IonContent>

      {isMultiselect ? null : toEdit ? (
        <ChatEditFooter
          instanceId={instanceId}
          edit={toEdit}
          conversation={conversation}
          setToEdit={setToEdit}
        />
      ) : (
        <ChatFooter
          payload={payload}
          setPayload={setPayload}
          sendNewMessage={sendNewMessage}
        />
      )}
    </IonPage>
  );
};

export default ChatRoom;
