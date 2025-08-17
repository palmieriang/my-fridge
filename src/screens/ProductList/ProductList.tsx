import FloatingButton from "@components/FloatingButton/FloatingButton";
import ProductCard from "@components/ProductCard/ProductCard";
import SearchBar from "@components/SearchBar/SearchBar";
import SortButton from "@components/SortButton/SortButton";
import { useContext, useEffect, useRef, useState } from "react";
import { FlatList, Text, View } from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import styles from "./styles";
import { FRIDGE } from "../../constants";
import {
  ProductListNavigationProp,
  ProductListRouteProp,
} from "../../navigation/navigation.d";
import { localeStore, themeStore } from "../../store";
import { productsStore } from "../../store/productsStore";
import { convertToISODateString } from "../../utils";

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
  const [sortOrder, setSortOrder] = useState<"default" | "earlier" | "later">(
    "default",
  );

  const filteredList = place === FRIDGE ? fridgeProducts : freezerProducts;

  const searchFilteredList = filteredList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedList = [...searchFilteredList].sort((a, b) => {
    if (sortOrder === "default") {
      return 0;
    }

    const dateA = new Date(convertToISODateString(a.date));
    const dateB = new Date(convertToISODateString(b.date));

    if (sortOrder === "earlier") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  useEffect(() => {
    swipeableRefs.current = swipeableRefs.current.slice(0, sortedList.length);
  }, [sortedList.length]);

  const swipeableRefs = useRef<(SwipeableMethods | null)[]>([]);

  const handleAddProduct = () => {
    navigateToProductForm({
      title: t("addItem"),
    });
  };

  const handleSortToggle = () => {
    const nextOrder = {
      default: "earlier",
      earlier: "later",
      later: "default",
    } as const;
    setSortOrder(nextOrder[sortOrder]);
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
      <View style={styles.controlsContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("search")}
        />
        <SortButton sortOrder={sortOrder} onSortToggle={handleSortToggle} />
      </View>

      {sortOrder !== "default" && (
        <View
          style={[styles.sortIndicator, { backgroundColor: theme.foreground }]}
        >
          <Text style={[styles.sortIndicatorText, { color: theme.text }]}>
            {sortOrder === "earlier" && t("sortEarlier")}
            {sortOrder === "later" && t("sortLater")}
          </Text>
        </View>
      )}

      {sortedList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={sortedList}
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
          {t("noSearchResults")}
        </Text>
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{t("error")}</Text>
      )}

      <FloatingButton onPress={handleAddProduct} color={theme.primary} />
    </View>
  );
};

export default ProductList;
