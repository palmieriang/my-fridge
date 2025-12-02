import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

const BarcodeIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg width={width} height={height} fill={finalFill} viewBox="0 0 24 24">
      <Path d="M2 4h2v16H2zM5 4h1v16H5zM7 4h2v16H7zM11 4h1v16h-1zM13 4h2v16h-2zM17 4h1v16h-1zM19 4h1v16h-1zM21 4h1v16h-1z" />
      <Path d="M1 2h4v1H2v3H1zm22 0h-4v1h3v3h1zM1 22h4v-1H2v-3H1zm22 0h-4v-1h3v-3h1z" />
    </Svg>
  );
};

export default BarcodeIcon;
