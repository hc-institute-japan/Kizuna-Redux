/* Core CSS required for Ionic components to work properly */
import "@ionic/react/css/core.css";
import "@ionic/react/css/display.css";
import "@ionic/react/css/flex-utils.css";
import "@ionic/react/css/float-elements.css";
/* Basic CSS for apps built with Ionic */
import "@ionic/react/css/normalize.css";
/* Optional CSS utils that can be commented out */
import "@ionic/react/css/padding.css";
import "@ionic/react/css/structure.css";
import "@ionic/react/css/text-alignment.css";
import "@ionic/react/css/text-transformation.css";
import "@ionic/react/css/typography.css";
import React from "react";
import Container from "./containers";
import Auth from "./pages/Auth";
import "./theme/variables.css";

/**
 * @name App
 *
 * Root of the application. Encloses the app with the necessary containers. Proceed to Container to see all the containers
 */

const App: React.FC = () => (
  <Container>
    <Auth />
  </Container>
);

export default App;
