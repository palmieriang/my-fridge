import React, { useContext, useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import * as Progress from 'react-native-progress';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import UserIcon from '../../assets/user.svg';
import {
  uploadImageToFirebase,
  getProfileImageFromFirebase,
  deleteProfileImage,
} from '../../api/api';
import { firebase } from '../firebase/config';
import DeleteIcon from '../../assets/close.svg';

const imagesRef = firebase.storage().ref();

const Profile = () => {
  const [upload, setUpload] = useState({
    loading: false,
    progress: 0,
  });

  const [image, setImage] = useState({ uri: null });

  const { userData } = useContext(authStore);
  const { theme } = useContext(themeStore);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const {
          status,
        } = await ImagePicker.requestCameraRollPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  useEffect(() => {
    getProfileImageFromFirebase(userData.id)
      .then((url) => {
        setImage({ uri: url });
      })
      .catch((error) => console.log('Error: ', error));
  }, []);

  const uploadProgress = (ratio) => Math.round(ratio * 100);

  const monitorFileUpload = (uploadTask) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = uploadProgress(
          snapshot.bytesTransferred / snapshot.totalBytes
        );
        console.log('Upload is ' + progress + '% done');

        switch (snapshot.state) {
          case firebase.storage.TaskState.PAUSED: // or 'paused'
            console.log('Upload is paused');
            break;
          case firebase.storage.TaskState.RUNNING: // or 'running'
            console.log('Upload is running');
            setImage({});
            setUpload({ loading: true, progress });
            break;
        }
      },
      (error) => {
        console.log('Error: ', error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log('File available at', url);
          setImage({ uri: url });
          setUpload({ loading: false });
        });
      }
    );
  };

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      const blob = await new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest();
        xhr.onload = () => {
          resolve(xhr.response);
        };
        xhr.responseType = 'blob';
        xhr.open('GET', result.uri, true);
        xhr.send(null);
      });
      const metadata = {
        contentType: 'image/jpeg',
      };

      const uploadTask = imagesRef
        .child(`profileImages/${userData.id}`)
        .put(blob, metadata);
      monitorFileUpload(uploadTask);
    }
  };

  const deleteProfileImg = () => {
    deleteProfileImage(userData.id)
      .then(() => {
        setImage({});
      })
      .catch((error) => {
        console.info('Error: ', error);
      });
  };

  return (
    <View style={[styles.profile, { backgroundColor: theme.primary }]}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.pictureContainer} onPress={pickImage}>
          {!upload.loading && image.uri && (
            <View>
              <Image source={image} style={styles.picture} />
              <DeleteIcon
                style={styles.deleteIcon}
                width={24}
                height={24}
                fill="#fff"
                onPress={deleteProfileImg}
              />
            </View>
          )}
          {!upload.loading && !image.uri && (
            <UserIcon width={150} height={150} />
          )}
          {upload.loading && (
            <View style={styles.progressContainer}>
              <Progress.Bar progress={upload.progress / 100} width={150} />
            </View>
          )}
        </View>
      </TouchableOpacity>
      <Text style={styles.profileField}>{userData.fullName}</Text>
      <Text style={styles.profileField}>{userData.email}</Text>
    </View>
  );
};

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
    position: 'relative',
  },
  profileField: {
    color: '#fff',
    marginTop: 20,
  },
  progressContainer: {
    flex: 1,
    justifyContent: 'center',
    maxHeight: 150,
  },
  deleteIcon: {
    bottom: 0,
    position: 'absolute',
    right: 0,
  },
});

export default Profile;
