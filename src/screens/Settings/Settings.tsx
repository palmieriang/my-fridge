import React, { useContext } from "react";
import { Alert, Button, Text, View } from "react-native";
import ModalSelector, { IOption } from "react-native-modal-selector";

import styles from "./styles";
import { authStore, localeStore, themeStore } from "../../store";
import Profile from "../Profile/Profile";

interface LanguageOption extends IOption {
  section?: boolean;
}

interface ThemeOption extends IOption {
  section?: boolean;
}

const Settings = () => {
  const {
    localizationContext: { t, changeLocale },
  } = useContext(localeStore);
  const {
    authContext,
    userData: { id },
  } = useContext(authStore);
  const {
    theme,
    themeContext: { changeTheme },
  } = useContext(themeStore);

  const languageData: LanguageOption[] = [
    { section: true, label: t("chooseLanguage"), key: "title" },
    { label: t("english"), value: "en", key: "english" },
    { label: t("spanish"), value: "es", key: "spanish" },
    { label: t("italian"), value: "it", key: "italian" },
    { label: t("french"), value: "fr", key: "french" },
    { label: t("portuguese"), value: "pt", key: "portuguese" },
  ];

  const themeData: ThemeOption[] = [
    { section: true, label: t("changeTheme"), key: "title" },
    { label: "Light Red", value: "lightRed", key: "lightRed" },
    { label: "Light Blue", value: "lightBlue", key: "lightBlue" },
    { label: "Dark Red", value: "darkRed", key: "darkRed" },
    { label: "Dark Blue", value: "darkBlue", key: "darkBlue" },
  ];

  const handleLocale = (locale: LanguageOption) => {
    const newLocale = locale.value;
    changeLocale({ newLocale, id });
  };

  const handleTheme = (theme: ThemeOption) => {
    const newTheme = theme.value;
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
      <ModalSelector
        animationType="fade"
        cancelText={t("cancel")}
        data={languageData}
        initValue={t("changeLanguage")}
        initValueTextStyle={styles.initValueTextStyle}
        onChange={handleLocale}
        style={styles.selectorContainer}
        sectionTextStyle={styles.text}
        selectTextStyle={styles.text}
        optionTextStyle={styles.text}
        cancelTextStyle={styles.text}
        optionContainerStyle={styles.optionContainer}
      />
      <ModalSelector
        animationType="fade"
        cancelText={t("cancel")}
        data={themeData}
        initValue={t("changeTheme")}
        initValueTextStyle={styles.initValueTextStyle}
        onChange={handleTheme}
        style={styles.selectorContainer}
        sectionTextStyle={styles.text}
        selectTextStyle={styles.text}
        optionTextStyle={styles.text}
        cancelTextStyle={styles.text}
        optionContainerStyle={styles.optionContainer}
      />
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
