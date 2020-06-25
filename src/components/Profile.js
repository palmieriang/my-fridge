import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, Button, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import UserIcon from '../../assets/user.svg';
import { firebase, storage } from '../firebase/config';

const Profile = () => {
    const [image, setImage] = useState(null);

    const { userData } = useContext(authStore);
    const { theme } = useContext(themeStore);

    const imagesRef = storage.ref();
    // console.info('profile', imagesRef);

    useEffect(() => {
        (async () => {
            if (Constants.platform.ios) {
                const { status } = await ImagePicker.requestCameraRollPermissionsAsync();
                if (status !== 'granted') {
                    alert('Sorry, we need camera roll permissions to make this work!');
                }
            }
        })();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        let filename = result.uri.split('/').pop();

        console.log(result);
        console.log(filename);

        if (!result.cancelled) {
            setImage(result.uri);
            // const profileRef = imagesRef.child(filename);
            // profileRef.put(result);
            uploadImageToFirebase(result.uri, userData.id);
        }
    };

    const uploadImageToFirebase = async (uri, userUID) => {

        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = () => {
                resolve(xhr.response);
            };
            xhr.responseType = 'blob';
            xhr.open('GET', uri, true);
            xhr.send(null);
        });
    
        const ref = firebase
            .storage()
            .ref()
            .child(`profiles/${userUID}`);
    
        let snapshot = await ref.put(blob);
    
        return await snapshot.ref.getDownloadURL();
    };

    return (
        <View style={[styles.profile, { backgroundColor: theme.primary }]}>
            <TouchableOpacity onPress={pickImage}>
                <View style={styles.pictureContainer} onPress={pickImage}>
                    {image ? (
                        <Image source={{ uri: image }} style={styles.picture} />
                    ) : (
                        <UserIcon width={150} height={150}/>
                    )}
                </View>
            </TouchableOpacity>
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
    picture: {
        height: 150,
        width: 150,
        borderRadius: 100,
    },
    profileField: {
        color: '#fff',
        marginTop: 20,
    }
});

export default Profile;
