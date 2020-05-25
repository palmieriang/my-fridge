import React, { useState, useEffect, useContext } from 'react';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { getProducts, getProductById } from '../../api/api';
import { LocalizationContext } from '../localization/localization';

import ProductCard from './ProductCard';

const ProductList = ({ navigation, route }) => {
    const { t } = useContext(LocalizationContext);
    const { place } = route.params;
    const [productList, setProductList] = useState([]);

    useEffect(() => {
        const updateState = navigation.addListener('focus', () => {
            getProducts(place)
            .then(products => setProductList(products.map(product => ({
                ...product,
                timer: Date.now(),
            }))))
            .catch(error => console.log('Error on get products list: ', error));
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

    return (
        <View style={{ flex: 1 }}>
            {productList.length > 0 ? (
                <FlatList
                    key="list"
                    style={styles.list}
                    data={productList}
                    renderItem={({ item }) => <ProductCard product={item} key={item.id} changeProduct={handleChangeProduct}  />}
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
        paddingTop: 20,
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

export default ProductList;
