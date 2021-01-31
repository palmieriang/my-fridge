import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import { uploadTaskFromApi } from '../../api/api';
import { adjust } from './utils/dimensions';
import { authStore } from '../store/authStore';
import { themeStore } from '../store/themeStore';
import UserIcon from './svg/UserIcon';
import DeleteIcon from './svg/DeleteIcon';

const Profile = () => {
  const [upload, setUpload] = useState({
    loading: false,
    progress: 0,
  });

  const {
    userData,
    authContext,
    authState: { profileImg },
  } = useContext(authStore);
  const { theme } = useContext(themeStore);

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const {
          status,
        } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          alert('Sorry, we need camera roll permissions to make this work!');
        }
      }
    })();
  }, []);

  const uploadProgress = (ratio) => Math.round(ratio * 100);

  const monitorFileUpload = (uploadTask) => {
    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log('Upload is ' + uploadProgress(progress) + '% done');

        setUpload({ loading: true, progress });

        switch (snapshot.state) {
          case 'paused': // or firebase.storage.TaskState.PAUSED
            console.log('Upload is paused');
            break;
          case 'running': // or firebase.storage.TaskState.RUNNING
            console.log('Upload is running');
            break;
        }
      },
      (error) => {
        console.log('Error: ', error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log('File available at', url);
          authContext.updateProfileImage(url);
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

      const uploadTask = uploadTaskFromApi(userData.id, blob, metadata);
      monitorFileUpload(uploadTask);
    }
  };

  const deleteProfileImg = () => {
    authContext.deleteImage(userData.id);
  };

  return (
    <View style={[styles.profile, { backgroundColor: theme.primary }]}>
      <TouchableOpacity onPress={pickImage}>
        <View style={styles.pictureContainer}>
          {!upload.loading && profileImg && (
            <View>
              <Image
                source={{ uri: profileImg }}
                imageStyle={styles.picture}
                indicator={Progress.Bar}
              />
              <DeleteIcon
                style={styles.deleteIcon}
                width={24}
                height={24}
                fill="#fff"
                onPress={deleteProfileImg}
              />
            </View>
          )}
          {!upload.loading && !profileImg && (
            <UserIcon width={150} height={150} />
          )}
          {upload.loading && (
            <View style={styles.progressContainer}>
              <Progress.Bar progress={upload.progress} width={150} />
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
    fontFamily: 'OpenSans-Regular',
    fontSize: adjust(13),
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
