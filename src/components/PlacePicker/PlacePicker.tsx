import { Picker } from "@react-native-picker/picker";
import { useContext } from "react";
import { Platform, Text, View } from "react-native";

import styles from "./styles";
import { FRIDGE, FREEZER } from "../../constants";
import { localeStore, themeStore } from "../../store";

type PlacePickerProps = {
  selectedPlace: "fridge" | "freezer" | "";
  onPlaceChange: (place: "fridge" | "freezer" | "") => void;
  error?: string;
};

export const PlacePicker: React.FC<PlacePickerProps> = ({
  selectedPlace,
  onPlaceChange,
  error,
}) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.foreground },
        error && styles.containerError,
      ]}
    >
      <Picker
        selectedValue={selectedPlace}
        onValueChange={onPlaceChange}
        itemStyle={Platform.OS === "ios" ? styles.iosHeight : undefined}
        style={[styles.picker, { color: theme.text }]}
      >
        <Picker.Item label={t("choosePlace")} value="" />
        <Picker.Item label={t(FRIDGE)} value="fridge" />
        <Picker.Item label={t(FREEZER)} value="freezer" />
      </Picker>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
