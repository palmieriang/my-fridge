import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { LocalizationContext } from '../localization/localization';
import { store } from '../store/store';

const Settings = () => {
    const { t, locale, setLocale } = useContext(LocalizationContext);
    const  languageData = [
        { section: true, label: t('chooseLanguage'), key: 'title'},
        { label: t('english'), value: 'en', key: 'english' },
        { label: t('italian'), value: 'it', key: 'italian' },
        { label: t('french'), value: 'fr', key: 'french' },
    ];

    const { authState, authContext } = useContext(store);
    const { user } = authState;

    const handleLogOut = () => {
        authContext.signOut();
    };

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ marginTop: 15, marginBottom: 15 }}>Welcome {user.email}</Text>
            <Text style={{ marginTop: 15, marginBottom: 15 }}>
                Current locale: {locale}.{' '}
                {locale !== 'en' && locale !== 'it' && locale !== 'fr'
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
            <View style={styles.logout}>
                <Button
                    title="Logout"
                    onPress={handleLogOut}
                />
            </View>
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
    logout: {
        marginTop: 20,
    }
});

export default Settings;
