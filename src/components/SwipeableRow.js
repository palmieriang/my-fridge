import React, { useContext, useRef } from 'react';
import { Animated, Text, View, StyleSheet, I18nManager } from 'react-native';
import PropTypes from 'prop-types';
import { localeStore } from '../store/localeStore';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

const SwipeableRow = ({ children, modifyFunction, deleteFunction }) => {
    const { localizationContext: { t } } = useContext(localeStore);
    const swipeableRef = useRef();

    const renderLeftActions = (progress, dragX) => {
        const trans = dragX.interpolate({
            inputRange: [0, 50, 100, 101],
            outputRange: [-20, 0, 0, 1],
        });

        return (
            <RectButton style={styles.leftAction} onPress={close}>
                <Animated.Text
                    style={[
                        styles.actionText,
                        {
                            transform: [{ translateX: trans }],
                        },
                    ]}
                >
                    {t('freeze')}
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

    const renderRightActions = progress => (
        <View style={{ width: 192, flexDirection: I18nManager.isRTL ? 'row-reverse' : 'row' }}>
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
}

SwipeableRow.propTypes = {
    children: PropTypes.element.isRequired,
    modifyFunction: PropTypes.func.isRequired,
    deleteFunction: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
    leftAction: {
        flex: 1,
        backgroundColor: '#497AFC',
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
    actionText: {
        color: 'white',
        fontSize: 16,
        backgroundColor: 'transparent',
        padding: 10,
    },
    rightAction: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginTop: 5,
        marginBottom: 5,
    },
});

export default SwipeableRow;
