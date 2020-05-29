import React, { useContext } from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { formatDate, getCountdownParts } from '../../api/api';
import { LocalizationContext } from '../localization/localization';
import { Swipeable } from 'react-native-gesture-handler';

const ProductCard = ({ product, changeProduct, deleteProduct }) => {
    const { t } = useContext(LocalizationContext);
    const { days } = getCountdownParts(product.date);

    const handleChange = () => {
        changeProduct(product.id);
    };

    const handleDeletePress = () => {
        console.log('Item deleted from swipe');
        deleteProduct(product.id);
    }

    const handleLeftAction = () => {
        return (
            <View style={styles.swipe}>
                <Text>Completed</Text>
            </View>
        );
    }

    const handleRightAction = () => {
        return (
            <View style={styles.swipe}>
                <Text>Removed</Text>
            </View>
        );
    }

    return (
        <Swipeable
            renderLeftActions={handleLeftAction}
            renderRightActions={handleRightAction}
            onSwipeableLeftOpen={handleDeletePress}
            onSwipeableRightOpen={() => console.log('closing')}
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
    swipe: {
        backgroundColor: 'green',
        // flex: 1,
        alignContent: 'center',
        marginTop: 5,
        marginBottom: 5,
    }
});

export default ProductCard;
