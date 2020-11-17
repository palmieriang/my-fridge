import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { getProductById, getProductsFromApi } from '../../api/api';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';

import ProductCard from './ProductCard';

const ProductList = ({ navigation, route }) => {
    const { localizationContext: { t } } = useContext(localeStore);
    const { authState: { user } } = useContext(authStore);
    const { theme } = useContext(themeStore);

    const { place } = route.params;
    const [productList, setProductList] = useState([]);

    const userID = user.uid;

    useEffect(() => {
        getProductsFromApi(userID, place)
            .then(response => {
                const newList = response.map(product => ({
                    ...product,
                    date: new Date(product.date),
                    timer: Date.now()
                }))
                setProductList(newList);
            })
            .catch(error => console.log('Error: ', error));
    }, [productList]);

    const handleAddProduct = () => {
        navigation.navigate('form', {
            title: t('addItem'),
        });
    };

    const handleChangeProduct = (id) => {
        getProductById(id)
            .then((response) => {
                const product = response.data();

                navigation.navigate('form', {
                    id,
                    product,
                    title: t('modifyItem'),
                })
            })
            .catch(error => console.log('Error: ', error));
    };

    const handleFreezeProduct = (id) => {
        const moveTo = place === 'fridge' ? 'freezer' : 'fridge';
        moveProduct(id, moveTo);
    }

    return (
        <View style={{ flex: 1 }}>
            {productList.length > 0 ? (
                <FlatList
                    key="list"
                    style={[ styles.list, { backgroundColor: theme.background }]}
                    data={productList}
                    renderItem={({ item }) => (
                        <ProductCard
                            product={item} key={item.id}
                            changeProduct={handleChangeProduct}
                            freezeProduct={handleFreezeProduct}
                        />
                    )}
                    keyExtractor={item => item.id}
                />
            ) : (
                <Text style={styles.text}>{t('error')}</Text>
            )}

            <ActionButton
                key="fab"
                onPress={handleAddProduct}
                buttonColor={theme.primary}
                hideShadow
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 10,
    },
    text: {
        height: 50,
        margin: 0,
        marginRight: 7,
        paddingLeft: 20,
        marginTop: 20,
    }
});

ProductList.propTypes = {
    navigation: PropTypes.shape({
        navigate: PropTypes.func.isRequired,
    }).isRequired,
    route: PropTypes.object.isRequired,
};

export default ProductList;
