import FloatingButton from "@components/FloatingButton/FloatingButton";
import ProductCard from "@components/ProductCard/ProductCard";
import { useContext, useEffect, useRef, useState } from "react";
import {
  FlatList,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
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

  const [searchQuery, setSearchQuery] = useState("");

  const filteredList = place === FRIDGE ? fridgeProducts : freezerProducts;

  const searchFilteredList = filteredList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  useEffect(() => {
    swipeableRefs.current = swipeableRefs.current.slice(
      0,
      searchFilteredList.length,
    );
  }, [searchFilteredList.length]);

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
      setSearchQuery("");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <View style={styles.searchContainer}>
        <TextInput
          style={[
            styles.searchInput,
            { color: theme.text, backgroundColor: theme.background },
          ]}
          placeholder={t("search") || "Search products..."}
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
          autoCapitalize="none"
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery("")}
          >
            <Text style={styles.clearButtonText}>✕</Text>
          </TouchableOpacity>
        )}
      </View>

      {searchFilteredList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={searchFilteredList}
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
      ) : filteredList.length > 0 ? (
        <Text style={[styles.noResultsText, { color: theme.text }]}>
          {t("noSearchResults") || "No products found matching your search."}
        </Text>
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{t("error")}</Text>
      )}

      <FloatingButton onPress={handleAddProduct} color={theme.primary} />
    </View>
  );
};

export default ProductList;
