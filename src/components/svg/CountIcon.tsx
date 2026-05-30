import { ColorValue } from "react-native";
import Svg, { G, Path, SvgProps } from "react-native-svg";

const CountIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24">
      <G fill={finalFill}>
        <Path d="M9.4 3l-.8 4H5v2h3.2l-.8 4H4v2h3l-.8 4h2l.8-4h4l-.8 4h2l.8-4H19v-2h-3.2l.8-4H20V7h-3l.8-4h-2l-.8 4h-4l.8-4H9.4zm.6 6h4l-.8 4h-4l.8-4z" />
      </G>
    </Svg>
  );
};

export default CountIcon;
