import { useNavigation } from "@react-navigation/native";
import { forwardRef } from "react";
import { Alert, Text, TouchableWithoutFeedback, View } from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import styles from "./styles";
import { FRIDGE, FREEZER } from "../../constants";
import { FormScreenNavigationProp } from "../../navigation/navigation.d";
import { useLocale, useProducts, useShoppingList, useTheme } from "../../store";
import { daysUntilDate, convertToDisplayFormat } from "../../utils";
import SwipeableRow from "../SwipeableRow/SwipeableRow";

type ProductCardProps = {
  product: {
    date: string;
    id: string;
    name: string;
    place: "fridge" | "freezer";
    quantity?: number;
  };
};

const ProductCard = forwardRef<SwipeableMethods, ProductCardProps>(
  ({ product }, ref) => {
    const { date, id, name, place, quantity } = product;

    const { navigate } = useNavigation<FormScreenNavigationProp>();

    const { t } = useLocale();
    const { theme } = useTheme();
    const { productsContext } = useProducts();
    const { shoppingListContext } = useShoppingList();

    const days = daysUntilDate(date);
    const expired = days < 0;
    const displayDate = convertToDisplayFormat(date);
    const outOfStock = quantity !== undefined && quantity <= 0;

    const handleAddToShoppingList = async () => {
      await shoppingListContext.handleAddItem(name);
      Alert.alert(
        t("addToShoppingList"),
        t("itemAddedToShoppingList").replace("{name}", name),
        [{ text: t("ok") }],
      );
    };

    const handleChange = () => {
      productsContext
        .handleGetProduct(id)
        .then((product) => {
          navigate("form", {
            id,
            product,
            title: t("modifyItem"),
          });
        })
        .catch((error) => console.log("Error: ", error));
    };

    const handleFreeze = () => {
      const moveTo = place === FRIDGE ? FREEZER : FRIDGE;
      productsContext.handleFreezeProduct(id, moveTo);
    };

    const handleDelete = () => {
      productsContext.handleDeleteProduct(id);
    };

    return (
      <SwipeableRow
        ref={ref}
        modifyFunction={handleChange}
        deleteFunction={handleDelete}
        freezeFunction={handleFreeze}
        place={place}
      >
        <View>
          <TouchableWithoutFeedback onPress={handleChange}>
            <View style={[styles.card, { backgroundColor: theme.foreground }]}>
              <View>
                <Text style={[styles.date, { color: theme.text }]}>
                  {displayDate}
                </Text>
                <View style={styles.titleRow}>
                  <Text
                    style={[styles.title, { color: theme.text }]}
                    numberOfLines={1}
                  >
                    {name}
                  </Text>
                  {quantity !== undefined && !outOfStock && (
                    <View style={styles.quantityBadge}>
                      <Text style={styles.quantityMultiplier}>×</Text>
                      <Text
                        style={[styles.quantityNumber, { color: theme.text }]}
                      >
                        {quantity}
                      </Text>
                    </View>
                  )}
                </View>
                {outOfStock && (
                  <View style={styles.outOfStockRow}>
                    <Text
                      style={[styles.outOfStockLabel, { color: theme.primary }]}
                    >
                      {t("outOfStock")}
                    </Text>
                    <Text
                      style={[
                        styles.shoppingListNudge,
                        { color: theme.primary },
                      ]}
                      onPress={handleAddToShoppingList}
                    >
                      {t("addToShoppingList")}
                    </Text>
                  </View>
                )}
              </View>

              {expired ? (
                <Text style={[styles.expired, { color: theme.primary }]}>
                  {t("expired")}
                </Text>
              ) : (
                <View style={styles.counterContainer}>
                  <Text style={[styles.counterText, { color: theme.primary }]}>
                    {days}
                  </Text>
                  <Text style={[styles.counterLabel, { color: theme.text }]}>
                    {t("days").toUpperCase()}
                  </Text>
                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SwipeableRow>
    );
  },
);

export default ProductCard;
