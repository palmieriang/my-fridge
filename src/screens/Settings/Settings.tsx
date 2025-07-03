import { Picker } from "@react-native-picker/picker";
import React, { useContext, useEffect, useState } from "react";
import { Alert, Button, Platform, Text, View } from "react-native";

import styles from "./styles";
import { authStore, localeStore, themeStore } from "../../store";
import Profile from "../Profile/Profile";

const Settings = () => {
  const {
    localizationContext: { t, changeLocale, locale },
  } = useContext(localeStore);
  const {
    authContext,
    userData: { id },
  } = useContext(authStore);
  const {
    theme,
    themeContext: { changeTheme, themeName },
  } = useContext(themeStore);

  const [selectedLocale, setSelectedLocale] = useState<string>(locale);
  const [selectedTheme, setSelectedTheme] = useState<string>(themeName);

  useEffect(() => {
    setSelectedLocale(locale);
  }, [locale]);

  useEffect(() => {
    setSelectedTheme(themeName);
  }, [themeName]);

  const languageData = [
    { section: true, label: t("chooseLanguage"), key: "title" },
    { label: t("english"), value: "en", key: "english" },
    { label: t("spanish"), value: "es", key: "spanish" },
    { label: t("italian"), value: "it", key: "italian" },
    { label: t("french"), value: "fr", key: "french" },
    { label: t("portuguese"), value: "pt", key: "portuguese" },
  ];

  const themeData = [
    { section: true, label: t("changeTheme"), key: "title" },
    { label: "Light Red", value: "lightRed", key: "lightRed" },
    { label: "Light Blue", value: "lightBlue", key: "lightBlue" },
    { label: "Dark Red", value: "darkRed", key: "darkRed" },
    { label: "Dark Blue", value: "darkBlue", key: "darkBlue" },
  ];

  const handleLocaleChange = (newLocale: string) => {
    setSelectedLocale(newLocale);
    changeLocale({ newLocale, id });
  };

  const handleThemeChange = (newTheme: string) => {
    setSelectedTheme(newTheme);
    changeTheme({ newTheme, id });
  };

  const handleLogOut = () => {
    authContext.signOut();
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
        <Text style={styles.initValueTextStyle}>{t("changeLanguage")}</Text>
        <Picker
          selectedValue={selectedLocale}
          onValueChange={handleLocaleChange}
          style={Platform.OS === "android" ? styles.androidPicker : undefined}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label={t("chooseLanguage")} value="" />
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
        <Text style={styles.initValueTextStyle}>{t("changeTheme")}</Text>
        <Picker
          selectedValue={selectedTheme}
          onValueChange={handleThemeChange}
          style={Platform.OS === "android" ? styles.androidPicker : undefined}
          dropdownIconColor={theme.text}
        >
          <Picker.Item label={t("chooseTheme") ?? "Choose theme"} value="" />
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
