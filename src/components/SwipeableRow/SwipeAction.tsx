import { Animated, Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";

import styles from "./styles";

type SwipeActionProps = {
  callback: () => void;
  color: string;
  progress: Animated.AnimatedInterpolation<string | number>;
  startValue: number;
  text: string;
};

const SwipeAction = ({
  callback,
  color,
  progress,
  startValue,
  text,
}: SwipeActionProps) => {
  const containerStyle = {
    flex: 1,
    transform: [{ translateX: progress }],
  };

  return (
    <Animated.View style={containerStyle}>
      <RectButton
        style={[styles.actionButton, { backgroundColor: color }]}
        onPress={callback}
      >
        <Text style={styles.actionText}>{text}</Text>
      </RectButton>
    </Animated.View>
  );
};

export default SwipeAction;
