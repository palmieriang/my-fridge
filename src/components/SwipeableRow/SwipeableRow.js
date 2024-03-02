import PropTypes from "prop-types";
import React, { useContext, useRef, useCallback } from "react";
import { Animated, Text, View, I18nManager } from "react-native";
import { RectButton, Swipeable } from "react-native-gesture-handler";

import styles from "./styles";
import { FRIDGE } from "../../constants";
import { localeStore } from "../../store";

const SwipeableRow = ({
  children,
  modifyFunction,
  deleteFunction,
  freezeFunction,
  place,
}) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const swipeableRef = useRef();

  const renderLeftActions = useCallback(
    (progress, dragX) => {
      const trans = dragX.interpolate({
        inputRange: [0, 50, 100, 101],
        outputRange: [-20, 0, 0, 1],
      });

      return (
        <RectButton style={styles.leftAction} onPress={freezeFunction}>
          <Animated.Text
            style={[
              styles.actionText,
              {
                transform: [{ translateX: trans }],
              },
            ]}
          >
            {place === FRIDGE ? t("freeze") : t(FRIDGE)}
          </Animated.Text>
        </RectButton>
      );
    },
    [freezeFunction, place, t],
  );

  const renderRightAction = useCallback(
    (text, color, startValue, progress, callback) => {
      const trans = progress.interpolate({
        inputRange: [0, 1],
        outputRange: [startValue, 0],
      });

      return (
        <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
          <RectButton
            style={[styles.rightAction, { backgroundColor: color }]}
            onPress={callback}
          >
            <Text style={styles.actionText}>{text}</Text>
          </RectButton>
        </Animated.View>
      );
    },
    [],
  );

  const renderRightActions = useCallback(
    (progress) => {
      const rightActions = [
        {
          text: t("modify"),
          color: "#ffab00",
          startValue: 192,
          progress,
          callback: modifyFunction,
        },
        {
          text: t("delete"),
          color: "#dd2c00",
          startValue: 64,
          progress,
          callback: deleteFunction,
        },
      ];

      return (
        <View
          style={{
            width: 192,
            flexDirection: I18nManager.isRTL ? "row-reverse" : "row",
          }}
        >
          {rightActions.map((action, index) => (
            <Animated.View key={index}>
              {renderRightAction(
                action.text,
                action.color,
                action.startValue,
                action.progress,
                action.callback,
              )}
            </Animated.View>
          ))}
        </View>
      );
    },
    [modifyFunction, deleteFunction, renderRightAction, t],
  );

  const close = () => {
    swipeableRef.current.close();
  };

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
};

SwipeableRow.propTypes = {
  children: PropTypes.element.isRequired,
  modifyFunction: PropTypes.func.isRequired,
  deleteFunction: PropTypes.func.isRequired,
};

export default SwipeableRow;
