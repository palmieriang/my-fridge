import React, { useContext, useState } from 'react';
import { Text, TouchableOpacity, View, StyleSheet, LogBox } from 'react-native';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNPickerSelect from 'react-native-picker-select';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import FormInput from '../components/FormInput';
import { formatDate } from '../../api/api';
import { adjust } from '../components/utils/dimensions';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import { productsStore } from '../store/productsStore';
import CalendarIcon from '../components/svg/CalendarIcon';
import ColdIcon from '../components/svg/ColdIcon';
import ShoppingBasketIcon from '../components/svg/ShoppingBasketIcon';

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
          labelValue={formatDate(date.toString())}
          onChangeText={handleChangeName}
          placeholderText={t('date')}
          Icon={CalendarIcon}
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
          <Text style={styles.buttonTitle}>
            {existingId ? t('modify') : t('add')}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={handleDeletePress}
          style={[styles.button, styles.buttonDelete]}
        >
          <Text style={styles.buttonTitle}>
            {existingId ? t('delete') : t('cancel')}
          </Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
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
    color: '#fff',
    fontFamily: 'OpenSans-Bold',
    fontSize: adjust(16),
    textShadowColor: '#000',
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
    textTransform: 'uppercase',
  },
  buttonDelete: {
    backgroundColor: '#e74c3c',
  },
});

export default ProductForm;
