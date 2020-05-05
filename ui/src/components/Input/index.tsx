import React from "react";
import { IonInput, IonLabel, IonText, IonContent } from "@ionic/react";
import styles from "./style.module.css";
import PropTypes from "prop-types";

/**
 * @name Input
 *
 * A reusable input field for the application.
 * Props:
 * Label - Label for the input
 * Error - Error message under the input field
 */

interface Props {
  label?: string;
  error?: string;
}

const Input: React.FC<Props> = (props) => {
  const { error, label } = { ...props };
  return (
    <div className="ion-margin-bottom">
      <IonLabel>{label}</IonLabel>
      <IonInput
        style={
          error
            ? error.trim().length > 0
              ? { borderBottomColor: "var(--ion-color-danger)" }
              : {}
            : {}
        }
        className={styles.input}
        {...props}
      />
      <IonLabel color="danger">{props.error}</IonLabel>
    </div>
  );
};

Input.defaultProps = {
  label: "",
  error: "",
};
Input.propTypes = {
  label: PropTypes.string,
  error: PropTypes.string,
};

export default Input;