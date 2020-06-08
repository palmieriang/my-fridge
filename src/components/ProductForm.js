import React, { useContext, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    TextInput,
    View,
    StyleSheet
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { formatDate, saveProduct, deleteProduct } from '../../api/api';
import { localeStore } from '../store/localeStore';

const ProductForm = ({ navigation, route }) => {
    const { params } = route;
    const { localizationContext: { t } } = useContext(localeStore);

    const existingName = params.product?.name || '';
    const existingDate = params.product?.date || '';
    const existingPlace = params.product?.place || '';
    const existingId = params.product?.id || '';
    const initPickerDate = existingDate ? new Date(existingDate) : new Date();

    const [name, setName] = useState('' || existingName);
    const [date, setDate] = useState('' || existingDate);
    const [place, setPlace] = useState('' || existingPlace);
    const [showDatePicker, setShowDatePicker] = useState(false);

    const handleChangeName = (value) => {
        setName(value);
    }

    const handleDatePress = () => {
        setShowDatePicker(true);
    }

    const handleDatePicked = (date) => {
        setDate(formatDate(date));
        handleDatePickerHide();
    }

    const handleDatePickerHide = () => {
        setShowDatePicker(false);
    }

    const handleAddPress = () => {
        if(name.length >= 3 && date && place) {
            saveProduct(name, date, place, existingId)
            .then(() => navigation.navigate('list'));

            console.log('Item added');
        }
    }

    const handleDeletePress = () => {
        console.log('Item deleted');
        deleteProduct(existingId)
            .then(() => navigation.navigate('list'));
    }

    return (
        <View style={{ flex: 1 }}>
            <TextInput
                style={styles.input}
                placeholder={t('product')}
                spellCheck={false}
                value={name}
                onChangeText={handleChangeName}
            />
            <TextInput
                style={styles.input}
                placeholder={t('date')}
                spellCheck={false}
                value={formatDate(date.toString())}
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
            <RNPickerSelect
                style={{
                    inputIOS: [styles.input],
                    inputAndroid: [styles.text],
                }}
                value={place}
                placeholder={{label: t('choosePlace')}}
                onValueChange={(itemValue) => setPlace(itemValue)}
                items={[
                    { label: t('fridge'), value: 'fridge', key: 'fridge' },
                    { label: t('freezer'), value: 'freezer', key: 'freezer' },
                ]}
            />
            <TouchableOpacity
                onPress={handleAddPress}
                style={styles.button}
            >
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
}

const styles = StyleSheet.create({
    input: {
        backgroundColor: 'white',
        borderRadius: 5,
        height: 48,
        marginTop: 10,
        marginBottom: 10,
        marginLeft: 30,
        marginRight: 30,
        overflow: 'hidden',
        paddingLeft: 16,
    },
    button: {
        alignItems: "center",
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
        fontSize: 16,
        fontWeight: 'bold',
    },
    buttonDelete: {
        backgroundColor: '#dc3545',
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5,
    },
});

export default ProductForm;
