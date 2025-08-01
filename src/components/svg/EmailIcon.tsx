import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { Path, SvgProps } from "react-native-svg";

const EmailIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg height={height} width={width} fill={finalFill} viewBox="0 0 512 512">
      <Path d="M467 61H45C20.218 61 0 81.196 0 106v300c0 24.72 20.128 45 45 45h422c24.72 0 45-20.128 45-45V106c0-24.72-20.128-45-45-45zm-6.214 30L256.954 294.833 51.359 91h409.427zM30 399.788V112.069l144.479 143.24L30 399.788zM51.213 421l144.57-144.57 50.657 50.222c5.864 5.814 15.327 5.795 21.167-.046L317 277.213 460.787 421H51.213zM482 399.787L338.213 256 482 112.212v287.575z" />
    </Svg>
  );
};

export default EmailIcon;
