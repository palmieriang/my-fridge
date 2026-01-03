import { Picker } from "@react-native-picker/picker";
import { FC } from "react";
import { Platform, Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";
import { FRIDGE, FREEZER } from "../../constants";
import { COLORS } from "../../constants/colors";
import { useLocale, useTheme } from "../../store";

type PlacePickerProps = {
  selectedPlace: "fridge" | "freezer" | "";
  onPlaceChange: (place: "fridge" | "freezer" | "") => void;
  error?: string;
  Icon: FC<SvgProps>;
};

export const PlacePicker: React.FC<PlacePickerProps> = ({
  selectedPlace,
  onPlaceChange,
  error,
  Icon,
}) => {
  const { t } = useLocale();
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.foreground },
        error && styles.containerError,
      ]}
    >
      <View style={styles.iconStyle}>
        <Icon width={25} height={25} fill={error ? COLORS.ERROR : theme.text} />
      </View>
      <Picker
        selectedValue={selectedPlace}
        onValueChange={onPlaceChange}
        itemStyle={Platform.OS === "ios" ? styles.iosHeight : undefined}
        style={[styles.picker, { color: theme.text }]}
        dropdownIconColor={theme.text}
      >
        <Picker.Item label={t("choosePlace")} value="" />
        <Picker.Item label={t(FRIDGE)} value="fridge" />
        <Picker.Item label={t(FREEZER)} value="freezer" />
      </Picker>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};
