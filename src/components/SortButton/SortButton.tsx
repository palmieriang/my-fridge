import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import styles from "./styles";
import { useTheme } from "../../store";

type SortOrder = "default" | "earlier" | "later";

interface SortButtonProps {
  sortOrder: SortOrder;
  onSortToggle: () => void;
}

const SortButton = ({ sortOrder, onSortToggle }: SortButtonProps) => {
  const { theme } = useTheme();

  const getSortIcon = () => {
    switch (sortOrder) {
      case "default":
        return <Ionicons name="swap-vertical" size={20} color={theme.text} />;
      case "earlier":
        return <Ionicons name="arrow-up" size={20} color={theme.text} />;
      case "later":
        return <Ionicons name="arrow-down" size={20} color={theme.text} />;
      default:
        return <Ionicons name="swap-vertical" size={20} color={theme.text} />;
    }
  };

  return (
    <TouchableOpacity
      style={[styles.sortButton, { backgroundColor: theme.foreground }]}
      onPress={onSortToggle}
    >
      {getSortIcon()}
    </TouchableOpacity>
  );
};

export default SortButton;
