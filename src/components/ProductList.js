import React, { useState, useEffect } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { getProducts, getProductById } from '../../api/api';

import ProductCard from './ProductCard';

const ProductList = ({ navigation, route }) => {
    const { place } = route.params;
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const updateState = navigation.addListener('focus', () => {
            getProducts(place)
            .then(products => setProductList(products.map(product => ({
                ...product,
                timer: Date.now(),
            }))));
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

    const handleChangeProduct = (id) => {
        getProductById(id)
            .then((product) => navigation.navigate('form', {product}))
            .catch(error => console.error('Error:', error));
    };

    const handleAddProduct = () => {
        navigation.navigate('form', {});
    };

    return (
        <View style={{ flex: 1 }}>
            <FlatList
                key="list"
                style={styles.list}
                data={productList}
                renderItem={({ item }) => <ProductCard product={item} key={item.id} changeProduct={handleChangeProduct}  />}
                keyExtractor={item => item.id}
            />

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
        paddingTop: 20,
        backgroundColor: '#F3F3F3',
    }
});

export default ProductList;
