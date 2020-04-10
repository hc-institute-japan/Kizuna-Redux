import React from "react";
import ApolloContainer from "./ApolloContainer";
import ReduxContainer from "./ReduxContainer";
import IonicContainer from "./IonicContainer";
import RouterContainer from "./RouterContainer";

const Container = ({ children }: { children: React.ReactNode }) => {
  /**
   * @name Container
   * Contains the whole application with the following containers:
   * Apollo - To be able to provide the graphql apollo client to the application which links the app to the backend (holochain)
   * Redux Container - To be able to provide the redux store to the whole application that provides an easier state management
   * Ionic - To be able to use ionic components and functionality in the whole application. Ionic provides useful components such as menu, drawer, content, footers, etc.
   *
   * Accepts children as props
   */

  return (
    <ApolloContainer>
      <ReduxContainer>
        <IonicContainer>
          <RouterContainer>{children}</RouterContainer>
        </IonicContainer>
      </ReduxContainer>
    </ApolloContainer>
  );
};

export default Container;
