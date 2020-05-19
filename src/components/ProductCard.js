import React from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { formatDate, getCountdownParts } from '../../api/api';

const ProductCard = ({ product, changeProduct }) => {
    const {
        days,
        hours,
        minutes,
        seconds,
    } = getCountdownParts(product.date);

    const handleChange = () => {
        changeProduct(product.id);
    };

    return (
         <View>
            <TouchableHighlight onPress={handleChange} >
                <View style={styles.card}>
                    <View style={styles.cardHeader}>
                        <Text style={styles.date}>{formatDate(product.date)}</Text>
                        <Text style={styles.title}>{product.name}</Text>
                    </View>
                    <View
                        style={styles.counterContainer}
                    >
                        <View
                            style={styles.counter}
                        >
                            <Text style={styles.counterText}>{days}</Text>
                            <Text style={styles.counterLabel}>DAYS</Text>
                        </View>
                        <View
                            style={styles.counter}
                        >
                            <Text style={styles.counterText}>{hours}</Text>
                            <Text style={styles.counterLabel}>HOURS</Text>
                        </View>
                        <View
                            style={styles.counter}
                        >
                            <Text style={styles.counterText}>{minutes}</Text>
                            <Text style={styles.counterLabel}>MINUTES</Text>
                        </View>
                        <View
                            style={styles.counter}
                        >
                            <Text style={styles.counterText}>{seconds}</Text>
                            <Text style={styles.counterLabel}>SECONDS</Text>
                        </View>
                    </View>
                </View>
            </TouchableHighlight>
        </View>
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
        padding: 10,
        paddingTop: 10,
        paddingBottom: 20,
        margin: 10,
        marginTop: 5,
        marginBottom: 5,
    },
    cardHeader: {
        flex: 1,
        flexDirection: 'row',
    },
    date: {
        fontWeight: '200',
        fontSize: 15,
        color: '#bdbdbd',
        width: '30%',
        textAlign: 'right',
    },
    title: {
        fontSize: 15,
        fontWeight: '300',
        marginLeft: 7,
        textAlign: 'left',
    },
    counterContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingLeft: '5%',
        paddingRight: '5%',
    },
    counter: {
        width: '25%',
        flex: 1,
    },
    counterText: {
        fontSize: 40,
        textAlign: 'center',
    },
    counterLabel: {
        fontSize: 13,
        fontWeight: '100',
        color: '#a3a3a3',
        textAlign: 'center',
        paddingTop: 0,
    },
});

export default ProductCard;
