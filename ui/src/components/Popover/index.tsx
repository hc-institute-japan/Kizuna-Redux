import React, { useState, useImperativeHandle } from "react";
import { IonPopover } from "@ionic/react";

/**
 * @name Popover
 *
 * Reusable popover for the whole application. Has a show method that accepts an event for it to be placed
 * relative to the event that activated the popover. Has a hide method that hides the popover
 *
 * @param {Object} props - Prop object
 * @param {any} props.children - Content of the popover. Can be anything
 * @param ref - Ref passed to the imperativeHandler for reference functions
 */

const Popover = ({ children }: { children: React.ReactNode }, ref: any) => {
  const [popover, setPopover] = useState<{
    visible: boolean;
    event: any;
  }>({
    visible: false,
    event: null,
  });

  useImperativeHandle(ref, () => ({
    show: (event: any) => {
      event.persist();
      setPopover({
        visible: true,
        event,
      });
    },
    hide: () =>
      setPopover({
        visible: false,
        event: null,
      }),
  }));

  return (
    <IonPopover
      onDidDismiss={() =>
        setPopover({
          visible: false,
          event: null,
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
