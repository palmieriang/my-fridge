import { FC, useContext } from "react";
import { Alert, Text, View } from "react-native";

import styles from "./styles";
import { authStore, localeStore } from "../../store";
import Button from "../Button/Button";

export const UserActions: FC = () => {
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const { authContext, dispatch } = useContext(authStore);

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
    <View style={styles.container}>
      <Button text={t("logout")} onPress={handleLogOut} />
      <Text onPress={handleDeleteUser} style={styles.deleteLink}>
        {t("deleteAccount")}
      </Text>
    </View>
  );
};
