import { Picker } from "@react-native-picker/picker";
import { useContext, useEffect, useState } from "react";
import { Alert, Button, Text, View } from "react-native";

import { generateThemeData } from "./generateThemeData";
import styles from "./styles";
import { authStore, localeStore, themeStore } from "../../store";
import type { SupportedLocale } from "../../store/types";
import Profile from "../Profile/Profile";

const Settings = () => {
  const {
    localizationContext: { t, changeLocale, locale },
  } = useContext(localeStore);
  const {
    authContext,
    dispatch,
    userData: { id },
  } = useContext(authStore);
  const {
    theme,
    themeName,
    themeContext: { changeTheme },
    availableThemes,
  } = useContext(themeStore);

  const [selectedLocale, setSelectedLocale] = useState<SupportedLocale>(locale);
  const [selectedTheme, setSelectedTheme] = useState<string>(themeName);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedTheme(themeName);
  }, [themeName]);

  const languageData = [
    { label: t("chooseLanguage"), value: "", key: "title" },
    { label: t("english"), value: "en", key: "english" },
    { label: t("spanish"), value: "es", key: "spanish" },
    { label: t("italian"), value: "it", key: "italian" },
    { label: t("french"), value: "fr", key: "french" },
    { label: t("german"), value: "de", key: "german" },
    { label: t("portuguese"), value: "pt", key: "portuguese" },
  ];

  const themeData = generateThemeData({
    availableThemes,
    changeThemeLabel: t("changeTheme"),
  });

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

  const handleLogOut = () => {
    authContext.signOut(dispatch);
  };

  const handleDeleteUser = () => {
    Alert.alert(t("attention"), t("deleteAccountMessage"), [
      {
        text: t("goBack"),
        onPress: () => null,
        style: "cancel",
      },
      {
        text: t("deleteConfirmation"),
        onPress: () => authContext.deleteUser(),
        style: "destructive",
      },
    ]);
  };

  return (
    <View
      style={{
        flex: 1,
        alignItems: "center",
        backgroundColor: theme.background,
      }}
    >
      <Profile />
      <View style={styles.selectorContainer}>
        <Picker
          selectedValue={selectedLocale}
          onValueChange={handleLocaleChange}
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
      <View style={styles.selectorContainer}>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={handleThemeChange}
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
      <View style={styles.auth}>
        <Button title="Logout" onPress={handleLogOut} />
        <Text onPress={handleDeleteUser} style={styles.authLink}>
          Delete account
        </Text>
      </View>
    </View>
  );
};

export default Settings;
