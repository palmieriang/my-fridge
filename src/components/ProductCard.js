import React, { useContext } from 'react';
import { Animated, Text, TouchableHighlight, View, StyleSheet, I18nManager } from 'react-native';
import PropTypes from 'prop-types';
import { formatDate, getCountdownParts } from '../../api/api';
import { LocalizationContext } from '../localization/localization';
import { RectButton, Swipeable } from 'react-native-gesture-handler';

const ProductCard = ({ product, changeProduct, deleteProduct }) => {
    const { t } = useContext(LocalizationContext);
    const { days } = getCountdownParts(product.date);

    const handleChange = () => {
        changeProduct(product.id);
    };

    const handleDeletePress = () => {
        console.log('Item deleted from swipe');
        // deleteProduct(product.id);
    }

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
                ]}>
                Archive
                </Animated.Text>
            </RectButton>
        );
    };

    const renderRightAction = (text, color, x, progress) => {
        const trans = progress.interpolate({
            inputRange: [0, 1],
            outputRange: [x, 0],
        });

        const pressHandler = () => {
            close();
            alert(text);
        };

        return (
          <Animated.View style={{ flex: 1, transform: [{ translateX: trans }] }}>
            <RectButton
              style={[styles.rightAction, { backgroundColor: color }]}
              onPress={pressHandler}>
              <Text style={styles.actionText}>{text}</Text>
            </RectButton>
          </Animated.View>
        );
    };

    const renderRightActions = progress => (
        <View style={{ width: 192, flexDirection: I18nManager.isRTL? 'row-reverse' : 'row' }}>
            {renderRightAction('More', '#C8C7CD', 192, progress)}
            {renderRightAction('Flag', '#ffab00', 128, progress)}
            {renderRightAction('More', '#dd2c00', 64, progress)}
        </View>
    );

    const updateRef = ref => {
        _swipeableRow = ref;
    };

    const close = () => {
        _swipeableRow.close();
    };
    return (
        <Swipeable
            ref={updateRef}
            renderLeftActions={renderLeftActions}
            renderRightActions={renderRightActions}
            onSwipeableLeftOpen={() => console.log('closing')}
            onSwipeableRightOpen={handleDeletePress}
            leftThreshold={30}
            rightThreshold={40}
        >
            <View>
                <TouchableHighlight onPress={handleChange} >
                    <View style={styles.card}>
                        <Text style={styles.date}>{formatDate(product.date)}</Text>
                        <Text style={styles.title}>{product.name}</Text>
                        <View style={styles.counterContainer}>
                            <Text style={styles.counterText}>{days}</Text>
                            <Text style={styles.counterLabel}>{t('days').toUpperCase()}</Text>
                        </View>
                    </View>
                </TouchableHighlight>
            </View>
        </Swipeable>
    );
}

ProductCard.propTypes = {
    product: PropTypes.shape({
        name: PropTypes.string.isRequired,
        date: PropTypes.instanceOf(Date)
    }),
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: '#fff',
        flex: 1,
        padding: 15,
        margin: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    date: {
        fontWeight: '200',
        fontSize: 15,
        marginBottom: 10,
    },
    title: {
        fontSize: 15,
        fontWeight: '300',
        marginBottom: 10,
    },
    counterContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'baseline',
    },
    counterText: {
        fontSize: 40,
    },
    counterLabel: {
        fontSize: 13,
        fontWeight: '100',
        marginLeft: 10,
    },
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

export default ProductCard;
