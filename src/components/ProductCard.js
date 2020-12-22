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

  const { navigate } = useNavigation();
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
        navigate('form', {
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
                <Text style={[styles.counterText, { color: theme.primary }]}>
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
    fontSize: 15,
    marginBottom: 10,
    fontFamily: 'OpenSansLight',
  },
  title: {
    fontFamily: 'OpenSansRegular',
    fontSize: 15,
    marginBottom: 10,
    marginTop: 5,
  },
  counterContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  counterText: {
    fontFamily: 'OpenSansBold',
    fontSize: 40,
  },
  counterLabel: {
    fontFamily: 'OpenSansLight',
    fontSize: 13,
    marginLeft: 10,
  },
  expired: {
    fontFamily: 'LilitaOne',
    fontSize: 40,
    textTransform: 'uppercase',
  },
});

export default ProductCard;
