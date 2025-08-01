import * as React from "react";
import { ColorValue } from "react-native";
import Svg, { G, Path, SvgProps } from "react-native-svg";

const CalendarIcon = ({ height, width, fill }: SvgProps) => {
  const finalFill: ColorValue = fill || "currentColor";

  return (
    <Svg
      height={height}
      width={width}
      fill={finalFill}
      viewBox="0 0 29.121 29.121"
    >
      <G fill={finalFill}>
        <Path d="M21.706 6.146c1.116 0 2.02-.898 2.02-2.016V2.02c0-1.119-.903-2.02-2.02-2.02s-2.019.9-2.019 2.02v2.111a2.014 2.014 0 002.019 2.015z" />
        <Path d="M28.882 3.494h-4.066v1.027a3.078 3.078 0 01-3.075 3.076 3.076 3.076 0 01-3.074-3.076V3.494h-8.205v1.027c0 1.695-1.379 3.076-3.076 3.076s-3.075-1.38-3.075-3.076V3.494L.208 3.443v25.678h26.656l2.049-.006-.031-25.621zm-2.02 23.582H2.26V10.672h24.604v16.404h-.002z" />
        <Path d="M7.354 6.146A2.016 2.016 0 009.375 4.13V2.02C9.375.9 8.47 0 7.354 0S5.336.9 5.336 2.02v2.111c0 1.117.901 2.015 2.018 2.015zM10.468 12.873h3.231v2.852h-3.231zM15.692 12.873h3.234v2.852h-3.234zM20.537 12.873h3.231v2.852h-3.231zM10.468 17.609h3.231v2.85h-3.231zM15.692 17.609h3.234v2.85h-3.234zM20.537 17.609h3.231v2.85h-3.231zM10.468 22.439h3.231v2.85h-3.231zM5.336 17.609h3.229v2.85H5.336zM5.336 22.439h3.229v2.85H5.336zM15.692 22.439h3.234v2.85h-3.234zM20.537 22.439h3.231v2.85h-3.231z" />
      </G>
    </Svg>
  );
};

export default CalendarIcon;
