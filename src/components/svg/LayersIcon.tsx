import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

const LayersIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg height={height} width={width} viewBox="0 0 24 24">
      <Path
        fill={finalFill}
        d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
        stroke={finalFill as string}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fillOpacity={0}
      />
    </Svg>
  );
};

export default LayersIcon;
