import { useContext, useEffect, useState } from "react";
import { View } from "react-native";

import styles from "./styles";
import { LanguagePicker } from "../../components/LanguagePicker/LanguagePicker";
import { ThemePicker } from "../../components/ThemePicker/ThemePicker";
import { UserActions } from "../../components/UserActions/UserActions";
import BrushIcon from "../../components/svg/BrushIcon";
import LanguageIcon from "../../components/svg/LanguageIcon";
import { authStore, localeStore, themeStore } from "../../store";
import type { SupportedLocale } from "../../store/types";
import Profile from "../Profile/Profile";

const Settings = () => {
  const {
    localizationContext: { changeLocale, locale },
  } = useContext(localeStore);
  const {
    userData: { id },
  } = useContext(authStore);
  const {
    theme,
    themeName,
    themeContext: { changeTheme },
  } = useContext(themeStore);

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>(locale);
  const [selectedTheme, setSelectedTheme] = useState<string>(themeName);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedTheme(themeName);
  }, [themeName]);

  const handleLocaleChange = (newLocale: SupportedLocale) => {
    if (!newLocale) return;
    setSelectedLocale(newLocale);
    changeLocale({ newLocale, id });
  };

  const handleThemeChange = (newTheme: string) => {
    if (!newTheme) return;
    setSelectedTheme(newTheme);
    changeTheme({ newTheme, id });
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <Profile />
      <LanguagePicker
        selectedLanguage={selectedLocale}
        onLanguageChange={handleLocaleChange}
        Icon={LanguageIcon}
      />
      <ThemePicker
        selectedTheme={selectedTheme}
        onThemeChange={handleThemeChange}
        Icon={BrushIcon}
      />
      <UserActions />
    </View>
  );
};

export default Settings;
