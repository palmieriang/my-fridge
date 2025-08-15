import { Text } from "react-native";
import { RectButton } from "react-native-gesture-handler";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

import styles from "./styles";

type SwipeActionProps = {
  callback: () => void;
  color: string;
  progress: Animated.SharedValue<number>;
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
  const containerStyle = useAnimatedStyle(() => ({
    width: 96,
    transform: [
      {
        translateX: progress.value,
      },
    ],
  }));

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
