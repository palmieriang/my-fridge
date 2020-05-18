import React, { useState } from 'react';
import { View, Text, TouchableHighlight, TextInput, StyleSheet } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { formatDateTime, saveProduct, deleteProduct } from '../api/api';

const styles = StyleSheet.create({
    fieldContainer: {
        marginTop: 20,
        marginBottom: 20,
        backgroundColor: '#fff',
    },
    text: {
        height: 40,
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

const ProductForm = ({ navigation, route }) => {
    const { params } = route;

    const existingName = params.product?.name || '';
    const existingDate = params.product?.date || '';
    const existingId = params.product?.id || '';

    const [name, setName] = useState('' || existingName);
    const [date, setDate] = useState('' || existingDate);
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
        console.log('Item added');
        saveProduct(name, date, existingId)
            .then(() => navigation.navigate('list'));
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

export default ProductForm;
