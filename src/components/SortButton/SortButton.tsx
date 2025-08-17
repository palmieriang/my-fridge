import { useContext } from "react";
import { TouchableOpacity, Text } from "react-native";

import styles from "./styles";
import { themeStore } from "../../store";

type SortOrder = "default" | "earlier" | "later";

interface SortButtonProps {
  sortOrder: SortOrder;
  onSortToggle: () => void;
}

const SortButton = ({ sortOrder, onSortToggle }: SortButtonProps) => {
  const { theme } = useContext(themeStore);

  const getSortIcon = () => {
    switch (sortOrder) {
      case "default":
        return "📅";
      case "earlier":
        return "⏰";
      case "later":
        return "⌛";
      default:
        return "📅";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.sortButton, { backgroundColor: theme.foreground }]}
      onPress={onSortToggle}
    >
      <Text style={styles.sortButtonText}>{getSortIcon()}</Text>
    </TouchableOpacity>
  );
};

export default SortButton;
