import { View, TextInput, TouchableOpacity, Text } from "react-native";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { useLocale, useTheme } from "../../store";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder }: SearchBarProps) => {
  const { t } = useLocale();
  const { theme } = useTheme();

  const handleClear = () => {
    onChangeText("");
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={[
          styles.searchInput,
          { color: theme.text, backgroundColor: theme.foreground },
        ]}
        placeholder={placeholder || t("search")}
        placeholderTextColor={COLORS.DARK_GRAY}
        value={value}
        onChangeText={onChangeText}
        autoCapitalize="none"
        accessibilityLabel={placeholder || t("search")}
      />
      {value.length > 0 && (
        <TouchableOpacity
          style={styles.clearButton}
          onPress={handleClear}
          accessibilityRole="button"
          accessibilityLabel={t("clearSearch")}
        >
          <Text style={styles.clearButtonText} accessibilityElementsHidden={true}>
            ✕
          </Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
