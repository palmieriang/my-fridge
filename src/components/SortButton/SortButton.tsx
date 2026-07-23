import { Ionicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";

import styles from "./styles";
import { useLocale, useTheme } from "../../store";

type SortOrder = "default" | "earlier" | "later";

interface SortButtonProps {
  sortOrder: SortOrder;
  onSortToggle: () => void;
}

const SortButton = ({ sortOrder, onSortToggle }: SortButtonProps) => {
  const { theme } = useTheme();
  const { t } = useLocale();

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

  const sortLabel = sortOrder === "earlier"
    ? t("sortEarlier")
    : sortOrder === "later"
      ? t("sortLater")
      : t("sortDefault");

  return (
    <TouchableOpacity
      style={[styles.sortButton, { backgroundColor: theme.foreground }]}
      onPress={onSortToggle}
      accessibilityRole="button"
      accessibilityLabel={sortLabel}
    >
      {getSortIcon()}
    </TouchableOpacity>
  );
};

export default SortButton;
