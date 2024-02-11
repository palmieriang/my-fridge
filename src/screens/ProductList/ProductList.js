import ProductCard from "@components/ProductCard/ProductCard";
import PropTypes from "prop-types";
import React, { useContext } from "react";
import { FlatList, Text, View } from "react-native";
import ActionButton from "react-native-action-button-warnings-fixed";

import styles from "./styles";
import { FRIDGE, FREEZER } from "../../constants";
import { localeStore, themeStore } from "../../store";
import { productsStore } from "../../store/productsStore";

const ProductList = ({ navigation, route }) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const { productsContext, productsList } = useContext(productsStore);

  const { place } = route.params;

  const filteredList = productsList.filter((item) => {
    return item.place === place;
  });

  const handleAddProduct = () => {
    navigation.navigate("form", {
      title: t("addItem"),
    });
  };

  const handleChangeProduct = (id) => {
    productsContext
      .handleGetProduct(id)
      .then((product) => {
        navigation.navigate("form", {
          id,
          product,
          title: t("modifyItem"),
        });
      })
      .catch((error) => console.log("Error: ", error));
  };

  const handleFreezeProduct = (id) => {
    const moveTo = place === FRIDGE ? FREEZER : FRIDGE;
    productsContext.handleFreezeProduct(id, moveTo);
  };

  return (
    <View style={{ flex: 1 }}>
      {filteredList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={filteredList}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              key={item.id}
              changeProduct={handleChangeProduct}
              freezeProduct={handleFreezeProduct}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.text}>{t("error")}</Text>
      )}

      <ActionButton
        key="fab"
        onPress={handleAddProduct}
        buttonColor={theme.primary}
        hideShadow
      />
    </View>
  );
};

ProductList.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
  route: PropTypes.object.isRequired,
};

export default ProductList;
