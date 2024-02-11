import React, { useContext, useState } from 'react';
import { View, StyleSheet, LogBox } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import { Picker } from '@react-native-picker/picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { convertToISODateString, convertToCustomFormat } from '../../utils';
import { authStore, localeStore, productsStore, themeStore } from '../../store';
import FormInput from '@components/FormInput/FormInput';
import Button from '@components/Button/Button';
import { adjust } from '@components/utils/dimensions';
import CalendarIcon from '@components/svg/CalendarIcon';
import ColdIcon from '@components/svg/ColdIcon';
import ShoppingBasketIcon from '@components/svg/ShoppingBasketIcon';
import { FRIDGE, FREEZER } from '../../constants';
import styles from './styles';

LogBox.ignoreLogs([
  'Non-serializable values were found in the navigation state',
]);

const ProductForm = ({ navigation, route }) => {
  const { params } = route;
  const {
    localizationContext: { t },
  } = useContext(localeStore);
  const {
    authState: { user },
  } = useContext(authStore);
  const { theme } = useContext(themeStore);
  const { productsContext } = useContext(productsStore);

  const existingId = params?.id || '';
  const initPickerDate = params.product?.date
    ? convertToISODateString(params.product?.date)
    : new Date();

  const [name, setName] = useState(params.product?.name || '');
  const [date, setDate] = useState(params.product?.date || '');
  const [place, setPlace] = useState(params.product?.place || '');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const userID = user.uid;

  const handleAddPress = () => {
    if (name.length >= 3 && date && place) {
      const data = {
        name,
        date,
        place,
        authorID: userID,
      };
      if (existingId) {
        productsContext
          .handleModifyProduct(data, existingId)
          .then(() => {
            navigation.navigate('list');
          })
          .catch((error) => console.log('Error: ', error));
      } else {
        productsContext
          .handleSaveProduct(data)
          .then(() => {
            navigation.navigate('list');
          })
          .catch((error) => console.log('Error: ', error));
      }
    } else {
      alert(
        'Please make sure to add a product name longer than 3 letters, a place and the expiring date'
      );
      return;
    }
  };

  const handleChangeName = (value) => {
    setName(value);
  };

  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDatePicked = (date) => {
    setDate(convertToCustomFormat(date));
    handleDatePickerHide();
  };

  const handleDatePickerHide = () => {
    setShowDatePicker(false);
  };

  const handleDeletePress = () => {
    if (existingId) {
      productsContext
        .handleDeleteProduct(existingId)
        .then(() => navigation.navigate('list'))
        .catch((error) => console.log('Error: ', error));
    } else {
      navigation.navigate('list');
    }
    console.log('Item deleted');
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
          placeholderText={t('product')}
          Icon={ShoppingBasketIcon}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
        />
        <FormInput
          labelValue={date}
          onChangeText={handleChangeName}
          placeholderText={t('date')}
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
            style={pickerSelectStyles}
            selectedValue={place}
            onValueChange={(itemValue) => setPlace(itemValue)}
          >
            <Picker.Item label={t('choosePlace')} value="" />
            <Picker.Item label={t(FRIDGE)} value="fridge" />
            <Picker.Item label={t(FREEZER)} value="freezer" />
          </Picker>
        </View>
        <Button
          text={existingId ? t('modify') : t('add')}
          onPress={handleAddPress}
        />
        <Button
          text={existingId ? t('delete') : t('cancel')}
          onPress={handleDeletePress}
          buttonDelete
        />
      </KeyboardAwareScrollView>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: '#ccc',
    fontSize: adjust(14),
    height: '100%',
    paddingLeft: 66,
  },
  inputAndroid: {
    borderColor: '#ccc',
    fontSize: adjust(14),
    height: '100%',
    marginLeft: 60,
    paddingLeft: 66,
  },
  iconContainer: {
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: StyleSheet.hairlineWidth,
    fontSize: adjust(14),
    justifyContent: 'center',
    height: '100%',
    left: 0,
    width: 54,
  },
  placeholder: {
    color: '#757575',
  },
});

export default ProductForm;
