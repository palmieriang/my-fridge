import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import UserIcon from '../../assets/user.svg';
import { uploadImageToFirebase } from '../../api/api';
import { firebase } from '../firebase/config';

const Profile = () => {
    const [image, setImage] = useState({});

    const { userData } = useContext(authStore);
    const { theme } = useContext(themeStore);

    const imagesRef = firebase.storage().ref();

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

    useEffect(() => {
        imagesRef.child(`profileImages/${userData.id}`).getDownloadURL()
        .then((url) => {
            setImage({
                uri: url,
            });
        })
        .catch(error => console.log('Error: ', error));
    }, [])

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage({
                uri: result.uri,
            });
            uploadImageToFirebase(result.uri, userData.id);
        }
    };

    return (
        <View style={[styles.profile, { backgroundColor: theme.primary }]}>
            <TouchableOpacity onPress={pickImage}>
                <View style={styles.pictureContainer} onPress={pickImage}>
                    {image.uri ? (
                        <Image source={image} style={styles.picture} />
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
