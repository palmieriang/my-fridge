import React, { useContext } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import ModalSelector from 'react-native-modal-selector';
import { localeStore } from '../store/localeStore';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import Profile from './Profile';

const Settings = () => {
    const { localizationContext: { t }, locale, setLocale } = useContext(localeStore);
    const { authContext, userData: { id } } = useContext(authStore);
    const { theme, themeContext: { changeTheme } } = useContext(themeStore);

    const languageData = [
        { section: true, label: t('chooseLanguage'), key: 'title' },
        { label: t('english'), value: 'en', key: 'english' },
        { label: t('italian'), value: 'it', key: 'italian' },
        { label: t('french'), value: 'fr', key: 'french' },
    ];

    const themeData = [
        { section: true, label: 'Change theme', key: 'title' },
        { label: 'Light Red', value: 'lightRed', key: 'lightRed' },
        { label: 'Light Blue', value: 'lightBlue', key: 'lightBlue' },
        { label: 'Dark Red', value: 'darkRed', key: 'darkRed' },
        { label: 'Dark Blue', value: 'darkBlue', key: 'darkBlue' },
    ];

    const handleLogOut = () => {
        authContext.signOut();
    };

    const handleTheme = (theme) => {
        const newTheme = theme.value;
        changeTheme({newTheme, id});
    };

    return (
        <View style={{ flex: 1, alignItems: 'center', backgroundColor: theme.background }}>
            <Profile />
            <Text style={{ marginTop: 15, marginBottom: 15, color: theme.text }}>
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
                style={styles.selectorContainer}
            />
            <ModalSelector
                animationType="fade"
                cancelText={t('cancel')}
                data={themeData}
                initValue="Change theme"
                initValueTextStyle={styles.initValueTextStyle}
                onChange={handleTheme}
                style={styles.selectorContainer}
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
    selectorContainer: {
        backgroundColor: '#fff',
        borderRadius: 5,
        marginTop: 20,
        minWidth: 200,
    },
    initValueTextStyle: {
        color: 'black',
    },
    logout: {
        marginTop: 20,
    }
});

export default Settings;
