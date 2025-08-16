import { useContext } from "react";
import { View, TextInput, TouchableOpacity, Text } from "react-native";

import styles from "./styles";
import { COLORS } from "../../constants/colors";
import { localeStore, themeStore } from "../../store";

interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

const SearchBar = ({ value, onChangeText, placeholder }: SearchBarProps) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);

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
      />
      {value.length > 0 && (
        <TouchableOpacity style={styles.clearButton} onPress={handleClear}>
          <Text style={styles.clearButtonText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SearchBar;
