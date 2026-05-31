import { Text, View } from "react-native";

import styles from "./OutOfStockRow.styles";

type OutOfStockRowProps = {
  color: string;
  outOfStockLabel: string;
  addToShoppingListLabel: string;
  onAddToShoppingList: () => void;
};

const OutOfStockRow = ({
  color,
  outOfStockLabel,
  addToShoppingListLabel,
  onAddToShoppingList,
}: OutOfStockRowProps) => {
  return (
    <View style={styles.row}>
      <Text style={[styles.label, { color }]}>{outOfStockLabel}</Text>
      <Text
        style={[styles.shoppingListNudge, { color }]}
        onPress={onAddToShoppingList}
      >
        {addToShoppingListLabel}
      </Text>
    </View>
  );
};

export default OutOfStockRow;
