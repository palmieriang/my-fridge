import { FC } from "react";
import { Alert, Text, TouchableOpacity, View } from "react-native";

import styles from "./styles";
import { useAuth, useLocale } from "../../store";
import Button from "../Button/Button";

export const UserActions: FC = () => {
  const { t } = useLocale();
  const { authContext, dispatch } = useAuth();

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
      <TouchableOpacity
        onPress={handleDeleteUser}
        accessibilityRole="button"
        accessibilityLabel={t("deleteAccount")}
        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
      >
        <Text style={styles.deleteLink}>{t("deleteAccount")}</Text>
      </TouchableOpacity>
    </View>
  );
};
