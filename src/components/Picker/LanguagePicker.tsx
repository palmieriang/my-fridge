import { Picker } from "@react-native-picker/picker";
import { FC } from "react";
import { Text, View } from "react-native";
import { SvgProps } from "react-native-svg";

import styles from "./styles";
import { useLocale, useTheme } from "../../store";
import type { SupportedLocale } from "../../store/types";

interface LanguagePickerProps {
  selectedLanguage: SupportedLocale;
  onLanguageChange: (language: SupportedLocale) => void;
  Icon?: FC<SvgProps>;
}

export const LanguagePicker: FC<LanguagePickerProps> = ({
  selectedLanguage,
  onLanguageChange,
  Icon,
}) => {
  const { t } = useLocale();
  const { theme } = useTheme();

  const languageData = [
    { label: t("english"), value: "en", key: "english" },
    { label: t("spanish"), value: "es", key: "spanish" },
    { label: t("italian"), value: "it", key: "italian" },
    { label: t("german"), value: "de", key: "german" },
    { label: t("french"), value: "fr", key: "french" },
    { label: t("portuguese"), value: "pt", key: "portuguese" },
  ];

  return (
    <>
      <Text style={[styles.label, { color: theme.text }]}>
        {t("changeLanguage")}
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
          <View style={styles.iconStyle}>
            <Icon width={25} height={25} fill={theme.text} />
          </View>
        )}
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={onLanguageChange}
          style={[
            styles.picker,
            {
              color: theme.text,
              backgroundColor: theme.foreground,
            },
          ]}
          dropdownIconColor={theme.text}
        >
          {languageData.map((lang) => (
            <Picker.Item
              key={lang.value}
              label={lang.label}
              value={lang.value}
            />
          ))}
        </Picker>
      </View>
    </>
  );
};
