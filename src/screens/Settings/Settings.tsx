import NotificationSettings from "@components/NotificationSettings/NotificationSettings";
import { OfflineIndicator } from "@components/OfflineIndicator/OfflineIndicator";
import { LanguagePicker } from "@components/Picker/LanguagePicker";
import { ThemePicker } from "@components/Picker/ThemePicker";
import { UserActions } from "@components/UserActions/UserActions";
import BrushIcon from "@components/svg/BrushIcon";
import LanguageIcon from "@components/svg/LanguageIcon";
import { useEffect, useState } from "react";
import { View } from "react-native";

import styles from "./styles";
import { useAuth, useLocale, useTheme } from "../../store";
import type { SupportedLocale } from "../../store/types";
import Profile from "../Profile/Profile";

const Settings = () => {
  const { changeLocale, locale } = useLocale();
  const { userData } = useAuth();
  const id = userData?.id;
  const {
    theme,
    themeName,
    themeContext: { changeTheme },
  } = useTheme();

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
      <OfflineIndicator />
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
      <NotificationSettings />
      <UserActions />
    </View>
  );
};

export default Settings;
