import React, { useContext, useEffect, useState } from 'react';
import { Text, TouchableWithoutFeedback, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { formatDate, getCountdownParts } from '../../../api/api';
import { localeStore, productsStore, themeStore } from '../../store';
import SwipeableRow from '../SwipeableRow/SwipeableRow';
import styles from './styles';

type ProductCardProps = {
  product: {
    date: Date;
    id: string;
    name: string;
    place: string;
  }
};

const ProductCard = ({ product }: ProductCardProps) => {
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
            <View>
              <Text style={[styles.date, { color: theme.text }]}>
                {formatDate(date.toString())}
              </Text>
              <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
            </View>

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

export default ProductCard;
