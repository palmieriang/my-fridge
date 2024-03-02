import LottieView from "lottie-react-native";
import PropTypes from "prop-types";
import React, { useEffect, useRef } from "react";
import { StyleSheet } from "react-native";

import DoorAnimation from "./15131-elevator-doors.json";

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
}) => {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current && play) {
      lottieRef.current.play();
    }
  }, [play]);

  useEffect(() => {
    if (reset) {
      lottieRef.current.reset();
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
};

const styles = StyleSheet.create({
  animation: {
    height: "100%",
    width: "100%",
  },
});

LottieAnimation.propTypes = {
  loop: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  play: PropTypes.bool.isRequired,
  animationEnd: PropTypes.func.isRequired,
};

export default LottieAnimation;
