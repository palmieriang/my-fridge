import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import { PlacePicker } from "@components/PlacePicker/PlacePicker";
import CalendarIcon from "@components/svg/CalendarIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import ShoppingBasketIcon from "@components/svg/ShoppingBasketIcon";
import { useContext } from "react";
import { KeyboardAvoidingView, ScrollView, Platform, Text } from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";
import { useProductForm } from "./useProductForm";
import {
  FormScreenNavigationProp,
  FormScreenRouteProp,
} from "../../navigation/navigation.d";
import { authStore, localeStore, productsStore, themeStore } from "../../store";

type ProductFormProps = {
  navigation: FormScreenNavigationProp;
  route: FormScreenRouteProp;
};

const ProductForm = ({ navigation, route }: ProductFormProps) => {
  const { params } = route;
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    authState: { user },
  } = useContext(authStore);
  const { theme } = useContext(themeStore);
  const { productsContext } = useContext(productsStore);

  const navigateToList = () => {
    navigation.navigate("list" as never);
  };

  const {
    name,
    date,
    place,
    showDatePicker,
    errors,
    isSubmitting,
    isDeleting,
    initPickerDate,
    handleChangeName,
    handleDatePress,
    handleDatePicked,
    handleDatePickerHide,
    handlePlaceChange,
    handleSubmit,
    handleDelete,
  } = useProductForm({
    existingProduct: params.product,
    existingId: params?.id || "",
    userID: user.uid,
    t,
    onSuccess: navigateToList,
    productsContext,
  });

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: theme.text }]}>
          {t("product")}
        </Text>
        <FormInput
          labelValue={name}
          onChangeText={handleChangeName}
          placeholderText={t("productPlaceholder")}
          Icon={ShoppingBasketIcon}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          error={errors.name}
          showError={!!errors.name}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          {t("expirationDate")}
        </Text>
        <FormInput
          labelValue={date}
          onChangeText={handleDatePress}
          placeholderText={t("datePickerPlaceholder")}
          Icon={CalendarIcon}
          editable={!showDatePicker}
          onFocus={handleDatePress}
          error={errors.date}
          showError={!!errors.date}
        />
        <DateTimePickerModal
          date={new Date(initPickerDate)}
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDatePicked}
          onCancel={handleDatePickerHide}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          {t("location")}
        </Text>
        <PlacePicker
          selectedPlace={place}
          onPlaceChange={handlePlaceChange}
          error={errors.place}
          Icon={FridgeIcon}
        />
        <Button
          text={params?.id ? t("modify") : t("add")}
          onPress={handleSubmit}
          variant="primary"
          disabled={isSubmitting}
        />
        <Button
          text={params?.id ? t("delete") : t("cancel")}
          onPress={params?.id ? handleDelete : navigateToList}
          variant="danger"
          disabled={isDeleting}
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
