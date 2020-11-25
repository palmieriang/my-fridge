import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback, View, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';
import { useNavigation } from '@react-navigation/native';
import { formatDate, getCountdownParts } from '../../api/api';
import { localeStore } from '../store/localeStore';
import { themeStore } from '../store/themeStore';
import { productsStore } from '../store/productsStore';
import SwipeableRow from './SwipeableRow';

const ProductCard = ({ product }) => {
  const { date, id, name, place } = product;

  const [expired, setExpired] = useState(false);

  const navigation = useNavigation();
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const { productsContext } = useContext(productsStore);

  const { days } = getCountdownParts(date);

  useEffect(() => {
    if (days < 0) {
      setExpired(true);
    } else {
      setExpired(false);
    }
  });

  const handleChange = () => {
    productsContext
      .handleGetProduct(id)
      .then((product) => {
        navigation.navigate('form', {
          id,
          product,
          title: t('modifyItem'),
        });
      })
      .catch((error) => console.log('Error: ', error));
  };

  const handleFreeze = () => {
    const moveTo = place === 'fridge' ? 'freezer' : 'fridge';
    productsContext.handleFreezeProduct(id, moveTo);
  };

  const handleDelete = () => {
    productsContext.handleDeleteProduct(id);
  };

  return (
    <SwipeableRow
      modifyFunction={handleChange}
      deleteFunction={handleDelete}
      freezeFunction={handleFreeze}
      place={place}
    >
      <View>
        <TouchableWithoutFeedback onPress={handleChange}>
          <View style={[styles.card, { backgroundColor: theme.foreground }]}>
            <Text style={[styles.date, { color: theme.text }]}>
              {formatDate(date)}
            </Text>
            <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
            {expired ? (
              <Text style={[styles.expired, { color: theme.primary }]}>
                {t('expired')}
              </Text>
            ) : (
              <View style={styles.counterContainer}>
                <Text style={[styles.counterText, { color: theme.text }]}>
                  {days}
                </Text>
                <Text style={[styles.counterLabel, { color: theme.text }]}>
                  {t('days').toUpperCase()}
                </Text>
              </View>
            )}
          </View>
        </TouchableWithoutFeedback>
      </View>
    </SwipeableRow>
  );
};

ProductCard.propTypes = {
  product: PropTypes.shape({
    name: PropTypes.string.isRequired,
    date: PropTypes.instanceOf(Date),
  }),
};

const styles = StyleSheet.create({
  card: {
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
    fontSize: 30,
    textTransform: 'uppercase',
    fontFamily: 'Courier',
    fontWeight: '500',
  },
});

export default ProductCard;
