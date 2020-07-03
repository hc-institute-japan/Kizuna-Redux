import { IonContent, IonText } from "@ionic/react";
import React, { Component } from "react";

const Err = () => (
  <IonContent>
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <IonText className="ion-text-center">
        <h2>A problem has occured </h2>
        <p>Consider restarting your app</p>
      </IonText>
    </div>
  </IonContent>
);

type Error = {
  error: boolean;
};

export default class ErrorContainer extends Component<{}, Error> {
  constructor(props: any) {
    super(props);
    this.state = {
      error: false,
    };
  }

  // componentDidCatch(error, info) {

  componentDidCatch() {
    this.setState({
      error: true,
    });
  }

  render() {
    return this.state.error ? <Err /> : this.props.children;
  }
}
