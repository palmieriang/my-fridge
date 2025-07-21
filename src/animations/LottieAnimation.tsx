import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { StyleSheet, ViewProps } from "react-native";

import DoorAnimation from "./15131-elevator-doors.json";

interface LottieAnimationProps extends ViewProps {
  autoplay: boolean;
  loop: boolean;
  name: keyof typeof ANIMATIONS;
  play: boolean;
  animationEnd: () => void;
  reset: boolean;
}

const ANIMATIONS = {
  door: DoorAnimation,
};

const LottieAnimation = ({
  loop,
  name,
  play,
  animationEnd,
  reset,
  ...props
}: LottieAnimationProps) => {
  const lottieRef = useRef<LottieView>(null);

  useEffect(() => {
    if (lottieRef.current && play) {
      lottieRef.current?.play();
    }
  }, [play]);

  useEffect(() => {
    if (reset) {
      lottieRef.current?.reset();
    }
  }, [reset]);

  if (name in ANIMATIONS) {
    return (
      <LottieView
        ref={lottieRef}
        source={ANIMATIONS[name]}
        loop={loop}
        onAnimationFinish={animationEnd}
        style={styles.animation}
        {...props}
      />
    );
  }

  return null;
};

const styles = StyleSheet.create({
  animation: {
    height: "100%",
    width: "100%",
  },
});

export default LottieAnimation;
