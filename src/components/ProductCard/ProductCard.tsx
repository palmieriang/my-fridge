import { useNavigation } from "@react-navigation/native";
import React, { useContext, useEffect, useState, forwardRef } from "react";
import { Text, TouchableWithoutFeedback, View } from "react-native";

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

const ProductCard = forwardRef(({ product }: ProductCardProps, ref) => {
  const { date, id, name, place } = product;

  const [expired, setExpired] = useState(false);

  const { navigate } = useNavigation<FormScreenNavigationProp>();

  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);
  const { productsContext } = useContext(productsStore);

  const days = daysUntilDate(date);

  useEffect(() => {
    if (days < 0) {
      setExpired(true);
    } else {
      setExpired(false);
    }
  });

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
              <Text style={[styles.title, { color: theme.text }]}>{name}</Text>
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
});

export default ProductCard;
