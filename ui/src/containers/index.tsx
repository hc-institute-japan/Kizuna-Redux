import React from "react";
import ToastContainer from "../components/Toast/ToastContainer";
import ToastProvider from "../components/Toast/ToastProvider";
import ApolloContainer from "./ApolloContainer";
import ErrorContainer from "./ErrorContainer";
import IonicContainer from "./IonicContainer";
import ReduxContainer from "./ReduxContainer";
import RouterContainer from "./RouterContainer";

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
const Container: React.FC = ({ children }) => (
  <ApolloContainer>
    <ReduxContainer>
      <IonicContainer>
        <ErrorContainer>
          <RouterContainer>
            {/* <P2PContainer> */}
            <ToastProvider>
              {children}
              <ToastContainer />
            </ToastProvider>
            {/* </P2PContainer> */}
          </RouterContainer>
        </ErrorContainer>
      </IonicContainer>
    </ReduxContainer>
  </ApolloContainer>
);

export default Container;
