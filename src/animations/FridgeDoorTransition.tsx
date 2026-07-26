import { useEffect } from "react";
import { StyleSheet, View, useWindowDimensions } from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

const ANIM_DURATION = 850;
const DOOR_COLOR = "#EFEFEF";
const HANDLE_COLOR = "#BDBDBD";
const HANDLE_WIDTH = 8;
const HANDLE_HEIGHT = 60;
const HANDLE_INSET = 20;

interface Props {
  onDone?: () => void;
}

const FridgeDoorTransition = ({ onDone }: Props) => {
  const { width, height } = useWindowDimensions();
  const leftX = useSharedValue(0);
  const rightX = useSharedValue(0);

  useEffect(() => {
    const easing = Easing.out(Easing.cubic);

    leftX.value = withTiming(-width / 2, { duration: ANIM_DURATION, easing });
    rightX.value = withTiming(
      width / 2,
      { duration: ANIM_DURATION, easing },
      (finished) => {
        if (finished && onDone) {
          runOnJS(onDone)();
        }
      },
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const leftStyle = useAnimatedStyle(() => ({
    width: width / 2,
    height,
    transform: [{ translateX: leftX.value }],
  }));

  const rightStyle = useAnimatedStyle(() => ({
    width: width / 2,
    height,
    transform: [{ translateX: rightX.value }],
  }));

  return (
    <View style={StyleSheet.absoluteFill}>
      {/* Left door panel */}
      <Animated.View style={[styles.door, styles.leftDoor, leftStyle]}>
        <View style={[styles.handle, styles.leftHandle]} />
      </Animated.View>

      {/* Right door panel */}
      <Animated.View style={[styles.door, styles.rightDoor, rightStyle]}>
        <View style={[styles.handle, styles.rightHandle]} />
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  door: {
    position: "absolute",
    top: 0,
    backgroundColor: DOOR_COLOR,
  },
  leftDoor: {
    left: 0,
    borderRightWidth: 1,
    borderRightColor: "#BDBDBD",
    shadowColor: "#000",
    shadowOffset: { width: 6, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  rightDoor: {
    right: 0,
    borderLeftWidth: 1,
    borderLeftColor: "#BDBDBD",
    shadowColor: "#000",
    shadowOffset: { width: -6, height: 0 },
    shadowOpacity: 0.12,
    shadowRadius: 8,
    elevation: 8,
  },
  handle: {
    position: "absolute",
    top: "50%",
    marginTop: -(HANDLE_HEIGHT / 2),
    width: HANDLE_WIDTH,
    height: HANDLE_HEIGHT,
    borderRadius: HANDLE_WIDTH / 2,
    backgroundColor: HANDLE_COLOR,
  },
  leftHandle: {
    right: HANDLE_INSET,
  },
  rightHandle: {
    left: HANDLE_INSET,
  },
});

export default FridgeDoorTransition;
