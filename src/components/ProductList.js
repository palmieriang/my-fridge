import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { FlatList, Text, StyleSheet, View } from 'react-native';
import ActionButton from 'react-native-action-button';
import { deleteProduct } from '../../api/api';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { firebase } from '../firebase/config';

import ProductCard from './ProductCard';

const ProductList = ({ navigation, route }) => {
    const { localizationContext: { t } } = useContext(localeStore);
    const { authState: { user } } = useContext(authStore);
    const { place } = route.params;
    const [productList, setProductList] = useState([]);

    const productRef = firebase.firestore().collection('products');
    const userID = user.uid;

    useEffect(() => {
        getProductsFromApi(userID, place)
     }, []);

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

    const getProductsFromApi = (userID, place) => {
        productRef
            .where("authorID", "==", userID)
            .where("place", "==", place)
            .orderBy('createdAt', 'desc')
            .onSnapshot(
                querySnapshot => {
                    const newProducts = []
                    querySnapshot.forEach(doc => {
                        const product = doc.data();
                        product.id = doc.id;
                        newProducts.push(product);
                    });
                    setProductList(newProducts.map(product => ({
                        ...product,
                        date: new Date(product.date),
                        timer: Date.now(),
                    })))
                },
                error => {
                    console.log(error)
                }
            )
    };

    const handleChangeProduct = (id) => {
        productRef
            .doc(id)
            .get()
            .then((response) => {
                const product = response.data();

                navigation.navigate('form', {
                    product,
                    title: t('modifyItem'),
                })
            })
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
