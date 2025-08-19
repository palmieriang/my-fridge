import { Picker } from "@react-native-picker/picker";
import { FC, useContext } from "react";
import { Text, View } from "react-native";

import { generateThemeData } from "./generateThemeData";
import styles from "./styles";
import { localeStore, themeStore } from "../../store";

interface ThemePickerProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
}

export const ThemePicker: FC<ThemePickerProps> = ({
  selectedTheme,
  onThemeChange,
}) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme, availableThemes } = useContext(themeStore);

  const themeData = generateThemeData({
    availableThemes,
  });

  return (
    <>
      <Text style={[styles.label, { color: theme.text }]}>
        {t("changeTheme")}
      </Text>
      <View
        style={[
          styles.selectorContainer,
          {
            backgroundColor: theme.foreground,
          },
        ]}
      >
        <Picker
          selectedValue={selectedTheme}
          onValueChange={onThemeChange}
          style={{
            color: theme.text,
            backgroundColor: theme.foreground,
          }}
          dropdownIconColor={theme.text}
        >
          {themeData.map((themeOption) => (
            <Picker.Item
              key={themeOption.value}
              label={themeOption.label}
              value={themeOption.value}
            />
          ))}
        </Picker>
      </View>
    </>
  );
};
