import * as React from "react";
import Svg, { Path } from "react-native-svg";

const FridgeIcon = ({ height, width, fill }) => {
  return (
    <Svg
      height={height}
      width={width}
      fill={fill}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 50 50"
    >
      <Path d="M33 0H15a5.006 5.006 0 0 0-5 5v38a5.006 5.006 0 0 0 5 5h18a5.006 5.006 0 0 0 5-5V5a5.006 5.006 0 0 0-5-5ZM12 5a3 3 0 0 1 3-3h18a3 3 0 0 1 3 3v11H12Zm24 38a3 3 0 0 1-3 3H15a3 3 0 0 1-3-3V18h24Z" />
      <Path d="M15 6a1 1 0 0 0-1 1v4a1 1 0 0 0 2 0V7a1 1 0 0 0-1-1ZM15 32a1 1 0 0 0 1-1v-7a1 1 0 0 0-2 0v7a1 1 0 0 0 1 1Z" />
    </Svg>
  );
};

export default FridgeIcon;
