import React from "react";
import ApolloContainer from "./ApolloContainer";
import ReduxContainer from "./ReduxContainer";
import IonicContainer from "./IonicContainer";
import RouterContainer from "./RouterContainer";
import ErrorContainer from "./ErrorContainer";
import ToastContainer from "../components/Toast/ToastContainer";
import ToastProvider from "../components/Toast/ToastProvider";

const Container = ({ children }: { children: React.ReactNode }) => {
  /**
   * @name Container
   * Contains the whole application with the following containers:
   * Apollo - To be able to provide the graphql apollo client to the application which links the app to the backend (holochain)
   * Redux Container - To be able to provide the redux store to the whole application that provides an easier state management
   * Ionic - To allow the app to use ionic components and its functionality in the whole application. Ionic provides useful components such as menu, drawer, content, footers, etc.
   * Router - To allow the app to use routing functions and components. Examples of router components are Switch, Redirect, Route, withRouter, etc.
   *
   * Accepts children as props
   */

  return (
    <ApolloContainer>
      <ReduxContainer>
        <IonicContainer>
          <ErrorContainer>
            <RouterContainer>
              <ToastProvider>
                {children}
                <ToastContainer />
              </ToastProvider>
            </RouterContainer>
          </ErrorContainer>
        </IonicContainer>
      </ReduxContainer>
    </ApolloContainer>
  );
};

export default Container;
