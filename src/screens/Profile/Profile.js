import DeleteIcon from "@components/svg/DeleteIcon";
import UserIcon from "@components/svg/UserIcon";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import { getDownloadURL } from "firebase/storage";
import React, { useContext, useState, useEffect } from "react";
import { Alert, View, Text, TouchableOpacity } from "react-native";
import Image from "react-native-image-progress";
import * as Progress from "react-native-progress";

import styles from "./styles";
import { uploadImage } from "../../../api/api";
import { authStore, themeStore } from "../../store";

const Profile = () => {
  const {
    userData,
    authContext,
    authState: { profileImg },
  } = useContext(authStore);
  const { theme } = useContext(themeStore);
  const [upload, setUpload] = useState({
    loading: false,
    progress: 0,
  });

  useEffect(() => {
    (async () => {
      if (Constants.platform.ios) {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Sorry, we need camera roll permissions to make this work!",
          );
        }
      }
    })();
  }, []);

  const handleUploadProgress = (snapshot) => {
    const progress = snapshot.bytesTransferred / snapshot.totalBytes;
    setUpload({ loading: true, progress });
  };

  const handleUploadError = (error) => {
    console.log("Error uploading image:", error);
    Alert.alert("Upload failed", "Failed to upload image. Please try again.");
    setUpload({ loading: false, progress: 0 });
  };

  const handleUploadComplete = (uploadTask) => {
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      authContext.updateProfileImage(downloadURL);
      setUpload({ loading: false, progress: 0 });
    });
  };

  const monitorFileUpload = (uploadTask) => {
    uploadTask.on(
      "state_changed",
      handleUploadProgress,
      handleUploadError,
      () => handleUploadComplete(uploadTask),
    );
  };

  const useImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        const { blob, metadata } = await getImageBlobAndMetadata(
          result.assets[0].uri,
        );

        const uploadTask = uploadImage(userData.id, blob, metadata);
        monitorFileUpload(uploadTask);
      }
    } catch (error) {
      console.error("Error in useImagePicker:", error);
    }
  };

  const getImageBlobAndMetadata = async (uri) => {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.statusText}`);
    }
    const blob = await response.blob();
    const metadata = { contentType: "image/jpeg" };

    return { blob, metadata };
  };

  const deleteProfileImg = () => {
    authContext.deleteImage(userData.id);
  };

  return (
    <View style={[styles.profile, { backgroundColor: theme.primary }]}>
      <TouchableOpacity onPress={useImagePicker}>
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

export default Profile;
