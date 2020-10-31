import React, { useState, useImperativeHandle, Ref } from "react";
import { IonPopover } from "@ionic/react";

/**
 * @name Popover
 *
 * Reusable popover for the whole application. Has a show method that accepts an event for it to be placed
 * relative to the event that activated the popover. Has a hide method that hides the popover
 *
 * @param {Object} props - Prop object
 * @param {React.ReactNode} props.children - Content of the popover. Can be anything
 * @param ref - Ref passed to the imperativeHandler for reference functions
 */

interface PopoverRefType {
  show(event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>): void;
  hide(): void;
}

const Popover = (
  { children }: { children: React.ReactNode },
  ref: Ref<PopoverRefType>
) => {
  const [popover, setPopover] = useState<{
    visible: boolean;
    event: any;
  }>({
    visible: false,
    event: undefined,
  });

  useImperativeHandle(ref, () => ({
    show: (event: React.MouseEvent<HTMLIonButtonElement, MouseEvent>) => {
      event.persist();
      setPopover({
        visible: true,
        event,
      });
    },
    hide: () => {
      setPopover({
        visible: false,
        event: undefined,
      });
    },
  }));

  return (
    <IonPopover
      onDidDismiss={() =>
        setPopover({
          visible: false,
          event: undefined,
        })
      }
      isOpen={popover.visible}
      event={popover.event}
    >
      {children}
    </IonPopover>
  );
};

export default React.forwardRef(Popover);
