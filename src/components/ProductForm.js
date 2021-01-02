import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, LogBox } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import FormInput from './FormInput';
import { formatDate } from '../../api/api';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import { productsStore } from '../store/productsStore';
import CalendarIcon from '../../assets/svg/calendar.svg';
import ColdIcon from '../../assets/svg/cold.svg';
import ShoppingBasketIcon from '../../assets/svg/shopping-basket.svg';

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
    ? new Date(params.product?.date)
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
    setDate(formatDate(date));
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
      <FormInput
        labelValue={name}
        onChangeText={handleChangeName}
        placeholderText={t('product')}
        Icon={ShoppingBasketIcon}
        autoCapitalize="sentences"
        autoCorrect={false}
        underlineColorAndroid="transparent"
      />
      <FormInput
        labelValue={formatDate(date.toString())}
        onChangeText={handleChangeName}
        placeholderText={t('date')}
        Icon={CalendarIcon}
        autoCorrect={false}
        editable={!showDatePicker}
        onFocus={handleDatePress}
      />
      <DateTimePickerModal
        date={initPickerDate}
        isVisible={showDatePicker}
        mode="date"
        onConfirm={handleDatePicked}
        onCancel={handleDatePickerHide}
      />
      <View style={styles.inputContainer}>
        <RNPickerSelect
          style={pickerSelectStyles}
          value={place}
          placeholder={{ label: t('choosePlace') }}
          onValueChange={(itemValue) => setPlace(itemValue)}
          items={[
            { label: t('fridge'), value: 'fridge', key: 'fridge' },
            { label: t('freezer'), value: 'freezer', key: 'freezer' },
          ]}
          Icon={() => {
            return <ColdIcon width={25} height={25} fill="black" />;
          }}
        />
      </View>

      <TouchableOpacity onPress={handleAddPress} style={styles.button}>
        {existingId ? (
          <Text style={styles.buttonTitle}>{t('modify')}</Text>
        ) : (
          <Text style={styles.buttonTitle}>{t('add')}</Text>
        )}
      </TouchableOpacity>
      <TouchableOpacity
        onPress={handleDeletePress}
        style={[styles.button, styles.buttonDelete]}
      >
        <Text style={styles.buttonTitle}>{t('delete')}</Text>
      </TouchableOpacity>
    </View>
  );
};

const pickerSelectStyles = StyleSheet.create({
  inputIOS: {
    borderColor: '#ccc',
    height: '100%',
    paddingLeft: 66,
  },
  inputAndroid: {
    borderColor: '#ccc',
    height: '100%',
    paddingLeft: 66,
  },
  iconContainer: {
    left: 0,
    width: 54,
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    borderRightColor: '#ccc',
    borderRightWidth: StyleSheet.hairlineWidth,
  },
});

const styles = StyleSheet.create({
  inputContainer: {
    backgroundColor: '#fff',
    borderColor: '#ccc',
    borderRadius: 5,
    borderWidth: StyleSheet.hairlineWidth,
    flex: 1,
    marginTop: 10,
    marginBottom: 10,
    marginLeft: 30,
    marginRight: 30,
    maxHeight: 54,
    overflow: 'hidden',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#48BBEC',
    borderRadius: 5,
    justifyContent: 'center',
    height: 48,
    marginLeft: 30,
    marginRight: 30,
    marginTop: 20,
  },
  buttonTitle: {
    color: 'white',
    fontFamily: 'OpenSansBold',
    fontSize: 16,
    textTransform: 'uppercase',
  },
  buttonDelete: {
    backgroundColor: '#e74c3c',
  },
});

export default ProductForm;
