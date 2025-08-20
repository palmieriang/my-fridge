import { useNavigation } from "@react-navigation/native";
import { useContext, forwardRef } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";
import { Swipeable } from "react-native-gesture-handler";

import styles from "./styles";
import { FRIDGE, FREEZER } from "../../constants";
import { FormScreenNavigationProp } from "../../navigation/navigation.d";
import { localeStore, productsStore, themeStore } from "../../store";
import { daysUntilDate } from "../../utils";
import SwipeableRow from "../SwipeableRow/SwipeableRow";

type ProductCardProps = {
  product: {
    date: string;
    id: string;
    name: string;
    place: "fridge" | "freezer";
  };
};

const ProductCard = forwardRef<Swipeable, ProductCardProps>(
  ({ product }, ref) => {
    const { date, id, name, place } = product;

    const { navigate } = useNavigation<FormScreenNavigationProp>();

    const {
      localizationContext: { t },
    } = useContext(localeStore);
    const { theme } = useContext(themeStore);
    const { productsContext } = useContext(productsStore);

    const days = daysUntilDate(date);
    const expired = days < 0;

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
                <Text style={[styles.date, { color: theme.text }]}>{date}</Text>
                <Text style={[styles.title, { color: theme.text }]}>
                  {name}
                </Text>
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
