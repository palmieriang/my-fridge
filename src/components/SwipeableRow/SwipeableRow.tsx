import React, {
  useContext,
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Animated, View, I18nManager } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import SwipeAction from "./SwipeAction";
import { FRIDGE } from "../../constants";
import { localeStore } from "../../store";

type SwipeableRowProps = {
  children: React.ReactElement;
  modifyFunction: () => void;
  deleteFunction: () => void;
  freezeFunction: () => void;
  place: "fridge" | "freezer";
};

type SwipeActionProps = {
  callback: () => void;
  color: string;
  progress: Animated.AnimatedInterpolation<string | number>;
  startValue: number;
  text: string;
};

type actionStyleProps = {
  flexDirection: "row-reverse" | "row";
  width: number;
};

const SwipeableRow = forwardRef(
  (
    {
      children,
      modifyFunction,
      deleteFunction,
      freezeFunction,
      place,
    }: SwipeableRowProps,
    ref,
  ) => {
    const {
      localizationContext: { t },
    } = useContext(localeStore);
    const swipeableRef = useRef<Swipeable>(null);

    useImperativeHandle(ref, () => ({
      close: () => {
        swipeableRef.current?.close();
      },
    }));

    const getActionStyle = (width: number): actionStyleProps => ({
      width,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    });

    const renderActions = (actions: SwipeActionProps[], width: number) => (
      <View style={getActionStyle(width)}>
        {actions.map((action, index) => (
          <SwipeAction key={index} {...action} />
        ))}
      </View>
    );

    const renderLeftActions = useCallback(
      (
        progress: Animated.AnimatedInterpolation<string | number>,
        _drag: Animated.AnimatedInterpolation<string | number>,
        _swipeable: Swipeable,
      ) => {
        const leftActions = [
          {
            callback: freezeFunction,
            color: "#497AFC",
            progress,
            startValue: -100,
            text: place === FRIDGE ? t("freeze") : t(FRIDGE),
          },
        ];

        return renderActions(leftActions, 96);
      },
      [freezeFunction, place, t],
    );

    const renderRightActions = useCallback(
      (
        progress: Animated.AnimatedInterpolation<string | number>,
        _drag: Animated.AnimatedInterpolation<string | number>,
        _swipeable: Swipeable,
      ) => {
        const rightActions = [
          {
            callback: modifyFunction,
            color: "#ffab00",
            progress,
            startValue: 100,
            text: t("modify"),
          },
          {
            callback: deleteFunction,
            color: "#dd2c00",
            progress,
            startValue: 100,
            text: t("delete"),
          },
        ];

        return renderActions(rightActions, 192);
      },
      [modifyFunction, deleteFunction, t],
    );

    return (
      <Swipeable
        ref={swipeableRef}
        renderLeftActions={renderLeftActions}
        renderRightActions={renderRightActions}
        leftThreshold={30}
        rightThreshold={40}
      >
        {children}
      </Swipeable>
    );
  },
);

export default SwipeableRow;
