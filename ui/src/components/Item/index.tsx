import {
  IonCheckbox,
  IonItem,
  Gesture,
  createGesture,
  GestureDetail,
} from "@ionic/react";
import React, { useState, useRef, useEffect } from "react";
import styles from "./style.module.css";

const threshold = 10;
const ListItem: React.FC<any> = ({ onClick, ...props }) => {
  /**
   * Boolean value needed for check box state
   */
  const [isChecked, setIsChecked] = useState(false);

  /**
   * Ref of the item needed for the implementation of gesture
   */
  const ref = useRef(null);

  /**
   * I store the timeout for the 1 second on hold callback here so that I can clearTimeout it when the required conditions are not met (
   *  Conditions:
   *    1. The location of the cursor/finger must be within 10 pixel (default value) of the intial cursor location value
   *    2. The cursor must be held for at least a second to trigger on hold function
   *  You may add more conditions if they're necessary. But for now, eto muna.
   * )
   */
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  /**
   * Timeout callback
   */
  const handleTimeout = () => props.multiselect.setIsMultiselect(true);

  /**
   * Callback for onStart. Fired when you click the element
   */
  const onStart = () => {
    timeoutRef.current = setTimeout(handleTimeout, 1000);
  };

  /**
   * Callback for onMove. Fired when you move your cursor when you're holding it.
   * Clears the timeout when the cursor goes out of the initial position
   */
  const onMove = (event: GestureDetail) => {
    if (
      Math.abs(event.deltaX) > threshold ||
      Math.abs(event.deltaY) > threshold
    )
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  /**
   * Callback for onEnd. Fired when you let go of your click
   */
  const onEnd = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };

  /**
   * If the item is not in multiselect mode. The checkbox will be set to unchecked
   */

  useEffect(() => {
    if (props.multiselect.isMultiselect) setIsChecked(false);
  }, [props.multiselect.isMultiselect]);

  /**
   * Creates the gesture handler for the item element.
   */

  useEffect(() => {
    const gesture: Gesture = createGesture({
      el: ref.current!, // ref of the element
      gestureName: "on-long-hold", // What you would call this gesture
      threshold: 0, // I forgot
      onStart, // Read onStart function
      onMove, // Read onMove function
      onEnd, // Read onEnd function
    });
    gesture.enable(); // creates the gesture
    return () => {
      gesture.destroy(); // destroys the gesture when the component is unmounted
    };
  }, []);

  return (
    <IonItem
      {...props}
      ref={ref}
      className={`${props.className} list-item`}
      onClick={() => {
        onClick();
        setIsChecked((curr) => !curr);
      }}
    >
      {props.multiselect.isMultiselect ? (
        <IonCheckbox
          color="primary"
          checked={isChecked}
          slot="start"
          className={`${styles.checkbox} ion-no-padding ion-no-margin ion-margin-end`}
          role="checkbox"
          aria-checked="true"
          aria-labelledby="ion-cb-0-lbl"
        >
          <input
            type="hidden"
            className="aux-input"
            name="ion-cb-0"
            value="on"
          />
        </IonCheckbox>
      ) : null}
      {props.children}
    </IonItem>
  );
};

export default ListItem;
