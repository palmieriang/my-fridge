import { Text, TouchableOpacity, View } from "react-native";

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
      <TouchableOpacity
        onPress={onAddToShoppingList}
        accessibilityRole="button"
        accessibilityLabel={addToShoppingListLabel}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={[styles.shoppingListNudge, { color }]}>
          {addToShoppingListLabel}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default OutOfStockRow;
