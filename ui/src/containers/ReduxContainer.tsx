import React from "react";
import store from "../redux/store";
const { Provider } = require("react-redux");

const ReduxContainer = ({ children }: { children: React.ReactNode }) => (
  <Provider store={store}>{children}</Provider>
);

export default ReduxContainer;
