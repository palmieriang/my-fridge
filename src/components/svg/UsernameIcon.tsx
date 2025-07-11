import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

const UsernameIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg height={height} width={width} fill={finalFill} viewBox="0 0 512 512">
      <Path d="M437.02 330.98c-27.883-27.882-61.071-48.523-97.281-61.018C378.521 243.251 404 198.548 404 148 404 66.393 337.607 0 256 0S108 66.393 108 148c0 50.548 25.479 95.251 64.262 121.962-36.21 12.495-69.398 33.136-97.281 61.018C26.629 379.333 0 443.62 0 512h40c0-119.103 96.897-216 216-216s216 96.897 216 216h40c0-68.38-26.629-132.667-74.98-181.02zM256 256c-59.551 0-108-48.448-108-108S196.449 40 256 40s108 48.448 108 108-48.449 108-108 108z" />
    </Svg>
  );
};

export default UsernameIcon;
