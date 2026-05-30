import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

const ShoppingListIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24">
      <Path
        d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"
        stroke={finalFill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fillOpacity={0}
      />
      <Path
        d="M3 6h18"
        stroke={finalFill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M9 11h.01M9 15h.01M13 11h3M13 15h3"
        stroke={finalFill}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export default ShoppingListIcon;
