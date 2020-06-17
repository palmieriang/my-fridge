import React, { useContext } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import UserIcon from '../../assets/user.svg';

const Profile = () => {
    const { userData } = useContext(authStore);
    const { theme } = useContext(themeStore);

    return (
        <View style={[styles.profile, { backgroundColor: theme.primary }]}>
            <View style={styles.pictureContainer}>
                {userData.avatar ? (
                    <Image source={userData.avatar} />
                ) : (
                    <UserIcon width={100} height={100}/>
                )}
            </View>
            <Text style={styles.profileField}>{userData.fullName}</Text>
            <Text style={styles.profileField}>{userData.email}</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    profile: {
        alignItems: 'center',
        paddingBottom: 30,
        width: '100%',
    },
    pictureContainer: {
        marginTop: 30,
    },
    profileField: {
        color: '#fff',
        marginTop: 20,
    }
});

export default Profile;
