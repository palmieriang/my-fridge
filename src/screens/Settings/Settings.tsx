import NotificationSettings from "@components/NotificationSettings/NotificationSettings";
import { OfflineIndicator } from "@components/OfflineIndicator/OfflineIndicator";
import { LanguagePicker } from "@components/Picker/LanguagePicker";
import { ThemePicker } from "@components/Picker/ThemePicker";
import { UserActions } from "@components/UserActions/UserActions";
import BrushIcon from "@components/svg/BrushIcon";
import LanguageIcon from "@components/svg/LanguageIcon";
import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { ScrollView, Text, TouchableOpacity, View } from "react-native";

import styles from "./styles";
import { useAppTutorial, useAuth, useLocale, useTheme } from "../../store";
import type { SupportedLocale } from "../../store/types";
import Profile from "../Profile/Profile";

const Settings = () => {
  const navigation = useNavigation<any>();
  const { changeLocale, locale, t } = useLocale();
  const { userData } = useAuth();
  const { appTutorialContext } = useAppTutorial();
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

  const handleOpenAppTutorial = () => {
    appTutorialContext.requestManualStart();
    navigation.getParent()?.navigate(t("fridge"));
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <OfflineIndicator />
      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
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
        <TouchableOpacity
          onPress={handleOpenAppTutorial}
          style={styles.tutorialRow}
          accessibilityRole="button"
          accessibilityLabel={t("appTutorial")}
        >
          <Text style={[styles.tutorialTitle, { color: theme.text }]}>
            📘 {t("appTutorial")}
          </Text>
          <Text style={[styles.tutorialDescription, { color: theme.text }]}>
            {t("appTutorialDescription")}
          </Text>
        </TouchableOpacity>
        <UserActions />
      </ScrollView>
    </View>
  );
};

export default Settings;
