import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableHighlight, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { formatDate, getCountdownParts } from '../../api/api';
import { localeStore } from '../store/localeStore';
import SwipeableRow from './SwipeableRow';

const ProductCard = ({ product, changeProduct, deleteProduct }) => {
    const [expired, setExpired] = useState(false);
    const { localizationContext: { t } } = useContext(localeStore);
    const { days } = getCountdownParts(product.date);

    useEffect(() => {
        if(days < 0) {
            setExpired(true);
        }
    }, []);

    const handleChange = () => {
        changeProduct(product.id);
    };

    const handleDelete = () => {
        deleteProduct(product.id);
    };

    return (
        <SwipeableRow modifyFunction={handleChange} deleteFunction={handleDelete}>
            <View>
                <TouchableHighlight onPress={handleChange} >
                    <View style={styles.card}>
                        <Text style={styles.date}>{formatDate(product.date)}</Text>
                        <Text style={styles.title}>{product.name}</Text>
                        {expired ? (
                            <Text style={styles.expired}>{t('expired')}</Text>
                        ) : (
                            <View style={styles.counterContainer}>
                                <Text style={styles.counterText}>{days}</Text>
                                <Text style={styles.counterLabel}>{t('days').toUpperCase()}</Text>
                            </View>
                        )}
                    </View>
                </TouchableHighlight>
            </View>
        </SwipeableRow>
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
    expired: {
        color: 'rgba(231, 76, 60, 1)',
        fontSize: 30,
        textTransform: 'uppercase',
        fontFamily: 'Courier',
        fontWeight: '500',
    },
});

export default ProductCard;
