import React, { useContext } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { LocalizationContext } from '../localization/localization';
import ModalSelector from 'react-native-modal-selector';

const Settings = () => {
    const { t, locale, setLocale } = useContext(LocalizationContext);
    const  languageData = [
        { section: true, label: t('chooseLanguage'), key: 'title'},
        { label: t('english'), value: 'en', key: 'english' },
        { label: t('italian'), value: 'it', key: 'italian' },
    ];

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ marginTop: 15, marginBottom: 15 }}>
                Current locale: {locale}.{' '}
                {locale !== 'en' && locale !== 'it'
                ? 'Translations will fall back to "en" because none available'
                : null}
            </Text>
            <ModalSelector
                animationType="fade"
                cancelText={t('cancel')}
                data={languageData}
                initValue={t('changeLanguage')}
                initValueTextStyle={styles.initValueTextStyle}
                onChange={(option) => setLocale(option.value)}
                style={styles.languageContainer}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    languageContainer: {
        marginTop: 20,
    },
    initValueTextStyle: {
        color: 'black',
    },
});

export default Settings;
