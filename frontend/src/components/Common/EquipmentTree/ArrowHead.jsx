import { androidArrowDropright } from "react-icons-kit/ionicons/androidArrowDropright";
import { androidArrowDropdown } from "react-icons-kit/ionicons/androidArrowDropdown";
import {plus} from 'react-icons-kit/ionicons/plus'
import {minus} from 'react-icons-kit/ionicons/minus'
import CustomIcon from "../../../libraries/CustomIcon";
import React, { Fragment } from "react";

let defaultStyle = {
    color: 'black'
}
export const ArrowHeadIconGroup = {
  right: {
    iconProps: {
      icon: plus,
      style: defaultStyle,
      size: 18,
    },
  },
  down: {
    iconProps: {
      icon: minus,
      style: defaultStyle,
      size: 18,
    },
  },
};

export const ArrowHead = (props) => {
  let { open, toggle } = props;
  return (
    <Fragment>
      <CustomIcon
        status={open ? "down" : "right"}
        iconGroup={ArrowHeadIconGroup}
        className={`equipment-user-action-icon arrow-head-${open ? 'open' : 'close'}`}
        onShortPress={toggle}
      />
    </Fragment>
  );
};
