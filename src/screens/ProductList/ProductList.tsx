import FloatingButton from "@components/FloatingButton/FloatingButton";
import ProductCard from "@components/ProductCard/ProductCard";
import React, { useContext, useEffect, useRef } from "react";
import { FlatList, Text, View } from "react-native";

import styles from "./styles";
import {
  ProductListNavigationProp,
  ProductListRouteProp,
} from "../../navigation/navigation.d";
import { localeStore, themeStore } from "../../store";
import { productsStore } from "../../store/productsStore";

type ProductListProps = {
  navigation: ProductListNavigationProp;
  route: ProductListRouteProp;
};

const ProductList = ({ navigation, route }: ProductListProps) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const { productsList } = useContext(productsStore);

  const { place } = route.params;

  const filteredList = productsList.filter((item) => item.place === place);

  const swipeableRefs = useRef([]);

  const handleAddProduct = () => {
    navigateToProductForm({
      title: t("addItem"),
    });
  };

  const navigateToProductForm = (params: { title: string }) => {
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
              ref={(el) => (swipeableRefs.current[index] = el)}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={styles.text}>{t("error")}</Text>
      )}

      <FloatingButton onPress={handleAddProduct} color={theme.primary} />
    </View>
  );
};

export default ProductList;
