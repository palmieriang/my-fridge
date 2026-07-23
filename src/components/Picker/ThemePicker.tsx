import { Picker } from "@react-native-picker/picker";
import { FC } from "react";
import { Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

import { generateThemeData } from "./generateThemeData";
import styles from "./styles";
import { useLocale, useTheme } from "../../store";

interface ThemePickerProps {
  selectedTheme: string;
  onThemeChange: (theme: string) => void;
  Icon?: FC<SvgProps>;
}

export const ThemePicker: FC<ThemePickerProps> = ({
  selectedTheme,
  onThemeChange,
  Icon,
}) => {
  const { t } = useLocale();
  const { theme, availableThemes } = useTheme();

  const themeData = generateThemeData({
    availableThemes,
    translate: t,
  });

  return (
    <>
      <Text style={[styles.label, { color: theme.text }]}>
        {t("changeTheme")}
      </Text>
      <View
        style={[
          styles.container,
          {
            backgroundColor: theme.foreground,
          },
        ]}
      >
        {Icon && (
          <View
            style={styles.iconStyle}
            importantForAccessibility="no-hide-descendants"
            accessibilityElementsHidden={true}
          >
            <Icon width={25} height={25} fill={theme.text} />
          </View>
        )}
        <Picker
          selectedValue={selectedTheme}
          onValueChange={onThemeChange}
          style={[
            styles.picker,
            {
              color: theme.text,
              backgroundColor: theme.foreground,
            },
          ]}
          dropdownIconColor={theme.text}
          accessibilityLabel={t("changeTheme")}
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
