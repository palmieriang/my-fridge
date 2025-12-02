import BarcodeScanner from "@components/BarcodeScanner/BarcodeScanner";
import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import { PlacePicker } from "@components/Picker/PlacePicker";
import BarcodeIcon from "@components/svg/BarcodeIcon";
import CalendarIcon from "@components/svg/CalendarIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import ShoppingBasketIcon from "@components/svg/ShoppingBasketIcon";
import { useCallback, useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";
import { useProductForm } from "./useProductForm";
import { lookupProductByBarcode } from "../../../api/openFoodFacts";
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

  const [showScanner, setShowScanner] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);

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

  const handleOpenScanner = useCallback(() => {
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      setShowScanner(false);
      setIsLookingUp(true);

      try {
        const result = await lookupProductByBarcode(barcode);

        if (result.found && result.product) {
          handleChangeName(result.product.name);
          Alert.alert(
            t("productFound"),
            t("productFoundMessage").replace("{name}", result.product.name),
          );
        } else {
          Alert.alert(
            t("productNotFound"),
            t("productNotFoundMessage").replace("{barcode}", barcode),
            [{ text: t("ok"), style: "default" }],
          );
        }
      } catch (error) {
        console.error("[BarcodeScanner] Error:", error);
        Alert.alert(t("error"), t("barcodeLookupError"));
      } finally {
        setIsLookingUp(false);
      }
    },
    [handleChangeName, t],
  );

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {!params?.id && (
          <View style={styles.scanButtonContainer}>
            {isLookingUp ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.scanningText, { color: theme.text }]}>
                  {t("lookingUpProduct")}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.scanButton, { borderColor: theme.primary }]}
                onPress={handleOpenScanner}
              >
                <BarcodeIcon width={24} height={24} fill={theme.primary} />
                <Text style={[styles.scanButtonText, { color: theme.primary }]}>
                  {t("scanBarcode")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

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
        <View style={styles.buttonContainer}>
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
        </View>
      </ScrollView>

      <BarcodeScanner
        visible={showScanner}
        onClose={handleCloseScanner}
        onBarcodeScanned={handleBarcodeScanned}
      />
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
