import React, { useContext, useRef } from 'react';
import PropTypes from 'prop-types';
import { Animated, Text, View, I18nManager } from 'react-native';
import { RectButton, Swipeable } from 'react-native-gesture-handler';
import { localeStore } from '../../store/localeStore';
import styles from './styles';

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

  const renderLeftActions = (progress, dragX) => {
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
          {place === 'fridge' ? t('freeze') : t('fridge')}
        </Animated.Text>
      </RectButton>
    );
  };

  const renderRightAction = (text, color, x, progress, callback) => {
    const trans = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [x, 0],
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
  };

  const renderRightActions = (progress) => (
    <View
      style={{
        width: 192,
        flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row',
      }}
    >
      {renderRightAction(t('modify'), '#ffab00', 192, progress, modifyFunction)}
      {renderRightAction(t('delete'), '#dd2c00', 64, progress, deleteFunction)}
    </View>
  );

  const close = () => {
    swipeableRef.current.close();
  };

  return (
    <Swipeable
      ref={swipeableRef}
      renderLeftActions={renderLeftActions}
      renderRightActions={renderRightActions}
      onSwipeableLeftOpen={() => console.log('closing')}
      onSwipeableRightOpen={() => console.log('closing')}
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
