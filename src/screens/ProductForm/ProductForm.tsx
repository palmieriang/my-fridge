import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import CalendarIcon from "@components/svg/CalendarIcon";
import ShoppingBasketIcon from "@components/svg/ShoppingBasketIcon";
import { Picker } from "@react-native-picker/picker";
import React, { useContext, useState } from "react";
import { View } from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";
import { validateProduct } from "./validateProduct";
import { FRIDGE, FREEZER } from "../../constants";
import {
  FormScreenNavigationProp,
  FormScreenRouteProp,
} from "../../navigation/navigation.d";
import { authStore, localeStore, productsStore, themeStore } from "../../store";
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
  const [place, setPlace] = useState(params.product?.place || "");
  const [showDatePicker, setShowDatePicker] = useState(false);

  const userID = user.uid;

  const handleAddPress = async () => {
    if (validateProduct(name, date, place, t)) {
      const data = {
        name,
        date,
        place,
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
        console.log("Error: ", error);
      }
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
    navigation.navigate("list");
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      <KeyboardAwareScrollView
        style={styles.container}
        keyboardShouldPersistTaps="always"
      >
        <FormInput
          labelValue={name}
          onChangeText={handleChangeName}
          placeholderText={t("product")}
          Icon={ShoppingBasketIcon}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
        />
        <FormInput
          labelValue={date}
          onChangeText={handleDatePress}
          placeholderText={t("date")}
          Icon={CalendarIcon}
          editable={!showDatePicker}
          onFocus={handleDatePress}
        />
        <DateTimePickerModal
          date={new Date(initPickerDate)}
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDatePicked}
          onCancel={handleDatePickerHide}
        />
        <View style={styles.inputContainer}>
          <Picker
            selectedValue={place}
            onValueChange={(itemValue) => setPlace(itemValue)}
            itemStyle={styles.iosHeight}
          >
            <Picker.Item label={t("choosePlace")} value="" />
            <Picker.Item label={t(FRIDGE)} value="fridge" />
            <Picker.Item label={t(FREEZER)} value="freezer" />
          </Picker>
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
      </KeyboardAwareScrollView>
    </View>
  );
};

export default ProductForm;
