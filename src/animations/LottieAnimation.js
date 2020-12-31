import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import LottieView from 'lottie-react-native';
import DoorAnimation from './15131-elevator-doors.json';

const ANIMATIONS = {
  door: DoorAnimation,
};

const LottieAnimation = ({ loop, name, play, animationEnd, style }) => {
  const lottieRef = useRef();

  useEffect(() => {
    if (lottieRef.current && play) {
      lottieRef.current.play();
    }
  }, [play]);

  if (name in ANIMATIONS) {
    return (
      <LottieView
        ref={lottieRef}
        source={ANIMATIONS[name]}
        loop={loop}
        onAnimationFinish={animationEnd}
        style={style}
      />
    );
  }
};

LottieAnimation.propTypes = {
  loop: PropTypes.bool.isRequired,
  name: PropTypes.string.isRequired,
  play: PropTypes.bool.isRequired,
  animationEnd: PropTypes.func.isRequired,
  style: PropTypes.object.isRequired,
};

export default LottieAnimation;
