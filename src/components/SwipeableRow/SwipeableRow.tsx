import {
  useRef,
  useCallback,
  forwardRef,
  useImperativeHandle,
  ReactElement,
} from "react";
import { View, I18nManager } from "react-native";
import Swipeable, {
  SwipeableMethods,
} from "react-native-gesture-handler/ReanimatedSwipeable";
import type { SharedValue } from "react-native-reanimated";

import SwipeAction from "./SwipeAction";
import { FRIDGE } from "../../constants";
import { useLocale } from "../../store";

type SwipeableRowProps = {
  children: ReactElement;
  modifyFunction: () => void;
  deleteFunction: () => void;
  freezeFunction: () => void;
  place: "fridge" | "freezer";
};

type SwipeActionProps = {
  callback: () => void;
  color: string;
  progress: SharedValue<number>;
  startValue: number;
  text: string;
};

type ActionStyleProps = {
  flexDirection: "row-reverse" | "row";
  width: number;
};

const SwipeableRow = forwardRef<SwipeableMethods, SwipeableRowProps>(
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
    const { t } = useLocale();
    const swipeableRef = useRef<SwipeableMethods>(null);

    useImperativeHandle(ref, () => ({
      close: () => {
        swipeableRef.current?.close();
      },
      openLeft: () => {
        swipeableRef.current?.openLeft();
      },
      openRight: () => {
        swipeableRef.current?.openRight();
      },
      reset: () => {
        swipeableRef.current?.reset();
      },
    }));

    const getActionStyle = (width: number): ActionStyleProps => ({
      width,
      flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
    });

    const renderActions = (actions: SwipeActionProps[], width: number) => (
      <View style={[getActionStyle(width), { flexDirection: "row" }]}>
        {actions.map((action, index) => (
          <SwipeAction key={index} {...action} />
        ))}
      </View>
    );

    const renderLeftActions = useCallback(
      (
        progress: SharedValue<number>,
        _translation: SharedValue<number>,
        _methods: SwipeableMethods,
      ) => {
        const leftActions = [
          {
            callback: freezeFunction,
            color: "#497AFC",
            progress,
            startValue: 0,
            text: place === FRIDGE ? t("freeze") : t(FRIDGE),
          },
        ];

        return renderActions(leftActions, 96);
      },
      [freezeFunction, place, t],
    );

    const renderRightActions = useCallback(
      (
        progress: SharedValue<number>,
        _translation: SharedValue<number>,
        _methods: SwipeableMethods,
      ) => {
        const rightActions = [
          {
            callback: modifyFunction,
            color: "#ffab00",
            progress,
            startValue: 0,
            text: t("modify"),
          },
          {
            callback: deleteFunction,
            color: "#dd2c00",
            progress,
            startValue: 0,
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
