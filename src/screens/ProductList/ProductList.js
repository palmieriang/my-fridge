import ProductCard from "@components/ProductCard/ProductCard";
import PropTypes from "prop-types";
import React, { useContext, useEffect, useRef } from "react";
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

  const swipeableRefs = useRef([]);

  const handleAddProduct = () => {
    navigateToProductForm({
      title: t("addItem"),
    });
  };

  const handleChangeProduct = async (id) => {
    try {
      const product = await productsContext.handleGetProduct(id);
      navigateToProductForm({ id, product, title: t("modifyItem") });
    } catch (error) {
      console.log("Error fetching product: ", error);
    }
  };

  const handleFreezeProduct = (id) => {
    const moveTo = place === FRIDGE ? FREEZER : FRIDGE;
    productsContext.handleFreezeProduct(id, moveTo);
  };

  const navigateToProductForm = (params) => {
    navigation.navigate("form", params);
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      swipeableRefs.current.forEach((ref) => ref?.close());
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1 }}>
      {filteredList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={filteredList}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              key={item.id}
              changeProduct={handleChangeProduct}
              freezeProduct={handleFreezeProduct}
              ref={(el) => (swipeableRefs.current[index] = el)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.text}>{t("error")}</Text>
      )}

      <ActionButton
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
