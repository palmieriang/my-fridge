import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import CalendarIcon from "@components/svg/CalendarIcon";
import ShoppingBasketIcon from "@components/svg/ShoppingBasketIcon";
import { Picker } from "@react-native-picker/picker";
import { useContext, useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  View,
  Alert,
  Text,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";
import { validateProductWithErrors } from "./validateProduct";
import { FRIDGE, FREEZER } from "../../constants";
import {
  FormScreenNavigationProp,
  FormScreenRouteProp,
} from "../../navigation/navigation.d";
import { authStore, localeStore, productsStore, themeStore } from "../../store";
import type { NewProduct } from "../../store/types";
import { convertToISODateString, convertToCustomFormat } from "../../utils";

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

  const existingId = params?.id || "";
  const initPickerDate = params.product?.date
    ? convertToISODateString(params.product?.date)
    : new Date();

  const [name, setName] = useState(params.product?.name || "");
  const [date, setDate] = useState(params.product?.date || "");
  const [place, setPlace] = useState<"fridge" | "freezer" | "">(
    params.product?.place || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    date?: string;
    place?: string;
  }>({});

  const userID = user.uid;

  const handleAddPress = async () => {
    setErrors({});

    const validation = validateProductWithErrors({ name, date, place, t });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    const data: NewProduct = {
      name: name.trim(),
      date,
      place: place as "fridge" | "freezer",
      authorID: userID,
    };

    try {
      if (existingId) {
        await productsContext.handleModifyProduct(data, existingId);
      } else {
        await productsContext.handleSaveProduct(data);
      }
      navigateToList();
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert(t("validationError"), t("productSaveError"));
    }
  };

  const handleChangeName = (value: string) => {
    setName(value);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (pickedDate: Date) => {
    setDate(convertToCustomFormat(pickedDate));
    handleDatePickerHide();
  };

  const handleDatePickerHide = () => {
    setShowDatePicker(false);
  };

  const handleDeletePress = async () => {
    try {
      if (existingId) {
        await productsContext.handleDeleteProduct(existingId);
      }
      navigateToList();
    } catch (error) {
      console.log("Error: ", error);
    }
  };

  const navigateToList = () => {
    navigation.navigate("list" as never);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        <FormInput
          labelValue={name}
          onChangeText={handleChangeName}
          placeholderText={t("product")}
          Icon={ShoppingBasketIcon}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          error={errors.name}
          showError={!!errors.name}
        />
        <FormInput
          labelValue={date}
          onChangeText={handleDatePress}
          placeholderText={t("date")}
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
        <View
          style={[
            styles.inputContainer,
            { backgroundColor: theme.foreground },
            errors.place && styles.pickerError,
          ]}
        >
          <Picker
            selectedValue={place}
            onValueChange={(itemValue) => setPlace(itemValue)}
            itemStyle={Platform.OS === "ios" ? styles.iosHeight : undefined}
            style={[styles.pickerPlaceholder, { color: theme.text }]}
          >
            <Picker.Item label={t("choosePlace")} value="" />
            <Picker.Item label={t(FRIDGE)} value="fridge" />
            <Picker.Item label={t(FREEZER)} value="freezer" />
          </Picker>
          {errors.place && (
            <Text style={styles.pickerErrorText}>{errors.place}</Text>
          )}
        </View>
        <Button
          text={existingId ? t("modify") : t("add")}
          onPress={handleAddPress}
        />
        <Button
          text={existingId ? t("delete") : t("cancel")}
          onPress={handleDeletePress}
          buttonDelete
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
