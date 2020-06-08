import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { getProducts, getProductById, deleteProduct } from '../../api/api';
import { localeStore } from '../store/localeStore';

import ProductCard from './ProductCard';

const ProductList = ({ navigation, route }) => {
    const { localizationContext: { t } } = useContext(localeStore);
    const { place } = route.params;
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const updateState = navigation.addListener('focus', () => {
            getProductsFromApi(place);
        });
        return updateState;
    }, [navigation]);

    useEffect(() => {
        if (productList.length > 0) {
            const intervalId = setInterval(() => { //assign interval to a variaable to clear it
                setProductList(productList.map(product => ({
                        ...product,
                        timer: Date.now(),
                    })),
                );
            }, 1000)

            return () => clearInterval(intervalId); //This is important
        }
    }, [productList]);

    const getProductsFromApi = (place) => {
        getProducts(place)
        .then(products => setProductList(products.map(product => ({
            ...product,
            timer: Date.now(),
        }))))
        .catch(error => console.log('Error on get products list: ', error));
    };

    const handleChangeProduct = (id) => {
        getProductById(id)
            .then((product) => navigation.navigate('form', {
                product,
                title: t('modifyItem'),
            }))
            .catch(error => console.log('Error: ', error));
    };

    const handleAddProduct = () => {
        navigation.navigate('form', {
            title: t('addItem'),
        });
    };

    const handleDelete = (id) => {
        deleteProduct(id);
        getProductsFromApi(place);
    }

    return (
        <View style={{ flex: 1 }}>
            {productList.length > 0 ? (
                <FlatList
                    key="list"
                    style={styles.list}
                    data={productList}
                    renderItem={({ item }) => (
                        <ProductCard product={item} key={item.id} changeProduct={handleChangeProduct} deleteProduct={handleDelete} />
                    )}
                    keyExtractor={item => item.id}
                />
            ) : (
                <Text style={styles.text}>{t('error')}</Text>
            )}

            <ActionButton
                key="fab"
                onPress={handleAddProduct}
                buttonColor="rgba(231, 76, 60, 1)"
                hideShadow
            />
        </View>
    );
}

const styles = StyleSheet.create({
    list: {
        flex: 1,
        paddingTop: 10,
        backgroundColor: '#F3F3F3',
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
