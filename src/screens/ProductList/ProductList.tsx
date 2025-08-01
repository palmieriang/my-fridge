import FloatingButton from "@components/FloatingButton/FloatingButton";
import ProductCard from "@components/ProductCard/ProductCard";
import { useContext, useEffect, useRef } from "react";
import { FlatList, Text, View } from "react-native";
import type { Swipeable } from "react-native-gesture-handler";

import styles from "./styles";
import { FRIDGE } from "../../constants";
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
  const { fridgeProducts, freezerProducts } = useContext(productsStore);

  const { place } = route.params;

  const filteredList = place === FRIDGE ? fridgeProducts : freezerProducts;

  const swipeableRefs = useRef<(Swipeable | null)[]>([]);

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
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {filteredList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={filteredList}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              key={item.id}
              ref={(el) => {
                swipeableRefs.current[index] = el;
              }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{t("error")}</Text>
      )}

      <FloatingButton onPress={handleAddProduct} color={theme.primary} />
    </View>
  );
};

export default ProductList;
