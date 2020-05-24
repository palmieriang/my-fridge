import React, { useEffect, useRef } from 'react';
import LottieView from 'lottie-react-native';
import DoorAnimation from './15131-elevator-doors.json';

const ANIMATIONS = {
    door: DoorAnimation,
};

const LottieAnimation = ({ loop, name, play, animationEnd }) => {
    const lottieRef = useRef();

    useEffect(() => {
        if(lottieRef.current && play) {
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
            />
        );
    }
};

export default LottieAnimation;
