import { IonList } from "@ionic/react";
import PropTypes from "prop-types";
import React, {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import ListItem from "../Item";

/**
 * @file A list component that supports multi select functionality via on long clicl/press
 *
 * @param {Array<any>} children - Items of the list. Additional props such as onClick, multiselect, etc. will be added to the direct children of this component.
 * @param {number} threshold - Pixel threshold for the long clicks. Once the user goes out of the initial cursor/pointer position + pixel threshold, the list will not transform its children into multi selectable items.
 * @param {function} onClick - Callback that will be triggered when clicking the direct children of this list. The index of the tem will be passed an argument to the callback functionn.
 * @param {function} onMultiselectClick - Callback that will be triggered when clicking the direct children of this list when the list is in its multi select mode. The index of the item will be passed as an argument to the callback function.
 * @param {function} isMultiselect - Callback that passes a boolean argument in order to determine if the list is in its multi-select mode.
 */

export interface ListRef {
  close(): void;
}

const List = forwardRef<any, any>((props, ref) => {
  /**
   * Used to determine if the list is in regular or multi select form
   */
  const [isMultiselect, setIsMultiselect] = useState(false);

  /**
   * The value of isMultiselect state will be passed as an argument to the isMultiselect prop callback. Can be used to determine if the list is in its multi-select mode outside the component. Ex. can be used to determine which header to use for the list.
   */
  useEffect(() => {
    props.isMultiselect(isMultiselect);
  }, [isMultiselect, props]);

  /**
   * Ref functions that can used outside the component to manipulate the mode of the list. (Can be used in Header to revert the list from multi-select mode to its regulary mode)
   * You can add an open function or maybe a toggle function if you like
   */
  useImperativeHandle(ref, () => ({
    close: () => setIsMultiselect(false),
  }));

  /**
   * Iterates the children then adds several props to each children
   */
  const children = React.Children.map(props.children, (child: any, i: number) =>
    React.cloneElement(child, {
      ...child.props,
      onClick: () =>
        isMultiselect
          ? child?.props?.onMultiselectClick
            ? child?.props?.onMultiselectClick(i)
            : props?.onMultiselectClick(i)
          : child.props.onClick
          ? child?.props?.onClick(i)
          : props?.onClick(i),
      multiselect: { isMultiselect, setIsMultiselect },
    })
  );

  return (
    <IonList className={`ios list-ios hydrated ${props.className || ""}`}>
      {children}
    </IonList>
  );
});

List.propTypes = {
  children: (props, propName) => {
    const prop = props[propName];
    React.Children.forEach(prop, (child) => {
      if (child.type.name !== ListItem.name)
        throw console.warn(
          `'List' should only have children of type ${ListItem.name}`
        );
    });
    return null;
  },
  onClick: PropTypes.func,
  onMultiselectClick: PropTypes.func,
  threshold: PropTypes.number,
};

List.defaultProps = {
  children: [],
  threshold: 10,
  onClick: () => {},
  onMultiselectClick: () => {},
};

export default List;
