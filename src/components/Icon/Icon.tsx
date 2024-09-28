import FreezerIcon from "@components/svg/FreezerIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import SettingsIcon from "@components/svg/SettingsIcon";
import React from "react";

import { FRIDGE, FREEZER, SETTINGS } from "../../constants";

type IconProps = {
  type: typeof FRIDGE | typeof FREEZER | typeof SETTINGS;
  size: string;
  fill: string;
  focused: boolean;
};

const Icon = ({ type, size, fill, focused }: IconProps) => {
  size = focused ? size : "22";
  const icons = {
    [FRIDGE]: <FridgeIcon height={size} width={size} fill={fill} />,
    [FREEZER]: <FreezerIcon height={size} width={size} fill={fill} />,
    [SETTINGS]: <SettingsIcon height={size} width={size} fill={fill} />,
  };

  return icons[type];
};

export default Icon;
