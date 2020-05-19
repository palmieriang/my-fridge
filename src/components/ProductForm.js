import React, { useState } from 'react';
import { View,
    Text, TouchableHighlight,
    TextInput,
    StyleSheet,
    Picker
} from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import RNPickerSelect from 'react-native-picker-select';
import { formatDateTime, saveProduct, deleteProduct } from '../../api/api';

const ProductForm = ({ navigation, route }) => {
    const { params } = route;

    const existingName = params.product?.name || '';
    const existingDate = params.product?.date || '';
    const existingPlace = params.product?.place || '';
    const existingId = params.product?.id || '';

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
        setDate(date);
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
            <View style={styles.fieldContainer}>
                <TextInput
                    style={styles.text}
                    placeholder="Product name"
                    spellCheck={false}
                    value={name}
                    onChangeText={handleChangeName}
                />
                <TextInput
                    style={[styles.text, styles.borderTop]}
                    placeholder="Expiring date"
                    spellCheck={false}
                    value={formatDateTime(date.toString())}
                    editable={!showDatePicker}
                    onFocus={handleDatePress}
                />
                <DateTimePickerModal
                    isVisible={showDatePicker}
                    mode="datetime"
                    onConfirm={handleDatePicked}
                    onCancel={handleDatePickerHide}
                />
                <RNPickerSelect
                    style={{
                        inputIOS: [styles.text, styles.borderTop],
                        inputAndroid: [styles.text, styles.borderTop],
                    }}
                    value={existingPlace}
                    placeholder={{label: 'Where do you want to add it?'}}
                    onValueChange={(itemValue) => setPlace(itemValue)}
                    items={[
                        { label: 'Fridge', value: 'fridge', key: 'fridge' },
                        { label: 'Freezer', value: 'freezer', key: 'freezer' },
                    ]}
                />
            </View>
            <TouchableHighlight
                onPress={handleAddPress}
                style={styles.button}
            >
                <Text style={styles.buttonText}>Add</Text>
            </TouchableHighlight>
            <TouchableHighlight
                onPress={handleDeletePress}
                style={[styles.button, styles.buttonDelete]}
            >
                <Text style={styles.buttonText}>Delete</Text>
            </TouchableHighlight>
        </View>
    );
}

const styles = StyleSheet.create({
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    text: {
        height: 50,
        margin: 0,
        marginRight: 7,
        paddingLeft: 10,
    },
    button: {
        height: 50,
        backgroundColor: '#48BBEC',
        borderColor: '#48BBEC',
        alignSelf: 'stretch',
        margin: 10,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 5,
    },
    buttonDelete: {
        backgroundColor: '#dc3545',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
    borderTop: {
        borderColor: '#edeeef',
        borderTopWidth: 0.5,
    },
});

export default ProductForm;
