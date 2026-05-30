import FreezerIcon from "@components/svg/FreezerIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import SettingsIcon from "@components/svg/SettingsIcon";
import ShoppingListIcon from "@components/svg/ShoppingListIcon";

import { FRIDGE, FREEZER, SETTINGS, SHOPPING_LIST } from "../../constants";

type IconProps = {
  type: typeof FRIDGE | typeof FREEZER | typeof SETTINGS | typeof SHOPPING_LIST;
  size: number;
  fill: string;
  focused: boolean;
};

const Icon = ({ type, size, fill, focused }: IconProps) => {
  size = focused ? size : 22;
  const icons = {
    [FRIDGE]: <FridgeIcon height={size} width={size} fill={fill} />,
    [FREEZER]: <FreezerIcon height={size} width={size} fill={fill} />,
    [SETTINGS]: <SettingsIcon height={size} width={size} fill={fill} />,
    [SHOPPING_LIST]: <ShoppingListIcon height={size} width={size} fill={fill} />,
  };

  return icons[type];
};

export default Icon;
