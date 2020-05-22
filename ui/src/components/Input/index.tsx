import { IonInput, IonLabel } from "@ionic/react";
import PropTypes from "prop-types";
import React from "react";
import styles from "./style.module.css";

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
  placeholder?: string;
  onIonChange(value: string): void;
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
        placeholder={props.placeholder}
        onIonChange={(e) => {
          props.onIonChange((e.target as HTMLInputElement).value);
        }}
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
