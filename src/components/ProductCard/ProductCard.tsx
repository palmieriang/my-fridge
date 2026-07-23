import ExpiryStatus from "@components/ProductCard/ExpiryStatus";
import OutOfStockRow from "@components/ProductCard/OutOfStockRow";
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
      navigate("form", {
        id,
        product: { id, name, date, place, quantity },
        title: t("modifyItem"),
      });
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
          <TouchableWithoutFeedback
            onPress={handleChange}
            accessible={true}
            accessibilityRole="button"
            accessibilityLabel={`${name}, ${expired ? t("expired") : `${days} ${t("days")}`}, ${displayDate}`}
            accessibilityHint={t("modifyItem")}
            accessibilityActions={[
              { name: "modify", label: t("modify") },
              { name: "delete", label: t("delete") },
              { name: "freeze", label: place === FRIDGE ? t("freeze") : t("fridge") },
            ]}
            onAccessibilityAction={(event) => {
              if (event.nativeEvent.actionName === "modify") handleChange();
              if (event.nativeEvent.actionName === "delete") handleDelete();
              if (event.nativeEvent.actionName === "freeze") handleFreeze();
            }}
          >
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
                  <OutOfStockRow
                    color={theme.primary}
                    outOfStockLabel={t("outOfStock")}
                    addToShoppingListLabel={t("addToShoppingList")}
                    onAddToShoppingList={handleAddToShoppingList}
                  />
                )}
              </View>

              <ExpiryStatus
                expired={expired}
                days={days}
                expiredLabel={t("expired")}
                daysLabel={t("days").toUpperCase()}
                primaryColor={theme.primary}
                textColor={theme.text}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </SwipeableRow>
    );
  },
);

export default ProductCard;
