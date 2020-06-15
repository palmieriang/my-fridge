import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { localeStore } from '../store/localeStore';
import Profile from './Profile';

const Settings = () => {
    const { localizationContext: { t }, locale, setLocale } = useContext(localeStore);
    const  languageData = [
        { section: true, label: t('chooseLanguage'), key: 'title'},
        { label: t('english'), value: 'en', key: 'english' },
        { label: t('italian'), value: 'it', key: 'italian' },
        { label: t('french'), value: 'fr', key: 'french' },
    ];

    const handleLogOut = () => {
        authContext.signOut();
    };

    return (
        <View style={{ flex: 1, alignItems: 'center' }}>
            <Profile />
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
