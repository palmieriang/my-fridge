import React, { useContext, useState } from 'react';
import {
    Text,
    TouchableOpacity,
    TextInput,
    View,
    StyleSheet,
    YellowBox,
    Button,
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { formatDate, saveProduct, modifyProduct, deleteProduct } from '../../api/api';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';

YellowBox.ignoreWarnings([
    'Non-serializable values were found in the navigation state',
]);

const ProductForm = ({ navigation, route }) => {
    const { params } = route;
    const { localizationContext: { t } } = useContext(localeStore);
    const { authState: { user } } = useContext(authStore);
    const { theme } = useContext(themeStore);

    const existingName = params.product?.name || '';
    const existingDate = params.product?.date || '';
    const existingPlace = params.product?.place || '';
    const existingId = params?.id || '';
    const initPickerDate = existingDate ? new Date(existingDate) : new Date();

    const [name, setName] = useState('' || existingName);
    const [date, setDate] = useState('' || existingDate);
    const [place, setPlace] = useState('' || existingPlace);
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
            if(existingId) {
                modifyProduct(data, existingId)
                    .then(_doc => {
                        navigation.navigate('list');
                    })
                    .catch(error => console.log('Error: ', error));
            } else {
                saveProduct(data)
                    .then(_doc => {
                        navigation.navigate('list');
                    })
                    .catch(error => console.log('Error: ', error));
            }
        }
    };

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

    const handleDeletePress = () => {
        if(existingId) {
            deleteProduct(existingId)
                .then(() => navigation.navigate('list'))
                .catch(error => console.log('Error: ', error));
        } else {
            navigation.navigate('list');
        }
        console.log('Item deleted');
    }

    const handleScanProduct = () => {
        navigation.navigate('scan');
    }

    return (
        <View style={{ flex: 1, backgroundColor: theme.background }}>
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
            <View style={styles.logout}>
                <Button
                    title="Scan"
                    onPress={handleScanProduct}
                />
            </View>
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
        backgroundColor: '#e74c3c',
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5,
    },
});

export default ProductForm;
