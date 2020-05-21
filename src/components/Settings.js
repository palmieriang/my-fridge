import React, { useContext } from 'react';
import { Button, Text, View } from 'react-native';
import { LocalizationContext } from '../localization/localization';

const Settings = () => {
    const { t, locale, setLocale } = useContext(LocalizationContext);

    return (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
            <Text>Settings</Text>
            <Text>
                Current locale: {locale}.{' '}
                {locale !== 'en' && locale !== 'it'
                ? 'Translations will fall back to "en" because none available'
                : null}
            </Text>
            {locale === 'en' ? (
                <Button title="Switch to Italian" onPress={() => setLocale('it')} />
            ) : (
                <Button title="Switch to English" onPress={() => setLocale('en')} />
            )}
        </View>
    );
}

export default Settings;
