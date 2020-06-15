import React, { useContext, useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import { authStore } from '../store/authStore';
import { firebase } from '../firebase/config';
import UserIcon from '../../assets/user.svg';

const Profile = () => {
    const { authState: { user } } = useContext(authStore);
    const [userData, setUserData] = useState({});
    const userRef = firebase.firestore().collection('users');
    const userID = user.uid;

    useEffect(() => {
        getUserData(userID)
    }, []);

    const getUserData = (userID) => {
        userRef
            .doc(userID)
            .get()
            .then((response) => {
                const userData = response.data();
                setUserData(userData);
            })
            .catch(error => console.log('Error: ', error));
    };

    return (
        <View style={styles.profile}>
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
        marginTop: 20,
    }
});

export default Profile;
