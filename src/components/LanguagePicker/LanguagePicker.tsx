import { Picker } from "@react-native-picker/picker";
import { FC, useContext } from "react";
import { Text, View } from "react-native";

import styles from "./styles";
import { localeStore, themeStore } from "../../store";
import type { SupportedLocale } from "../../store/types";

interface LanguagePickerProps {
  selectedLanguage: SupportedLocale;
  onLanguageChange: (language: SupportedLocale) => void;
}

export const LanguagePicker: FC<LanguagePickerProps> = ({
  selectedLanguage,
  onLanguageChange,
}) => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { theme } = useContext(themeStore);

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
          styles.selectorContainer,
          {
            backgroundColor: theme.foreground,
          },
        ]}
      >
        <Picker
          selectedValue={selectedLanguage}
          onValueChange={onLanguageChange}
          style={{
            color: theme.text,
            backgroundColor: theme.foreground,
          }}
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
