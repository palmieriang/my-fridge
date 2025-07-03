import DeleteIcon from "@components/svg/DeleteIcon";
import UserIcon from "@components/svg/UserIcon";
import * as ImagePicker from "expo-image-picker";
import {
  getDownloadURL,
  UploadTask,
  UploadTaskSnapshot,
} from "firebase/storage";
import React, { useContext, useState, useEffect } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import styles from "./styles";
import { uploadImage } from "../../../api/api";
import { authStore, themeStore } from "../../store";

type UploadState = {
  isUploading: boolean;
  uploadProgress: number;
};

const Profile = () => {
  const {
    userData,
    authContext,
    authState: { profileImg },
  } = useContext(authStore);
  const { theme } = useContext(themeStore);
  const [upload, setUpload] = useState<UploadState>({
    isUploading: false,
    uploadProgress: 0,
  });
  const [isProfileImageLoading, setIsProfileImageLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (Platform.OS === "ios") {
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Sorry, we need camera roll permissions to make this work!",
          );
        }
      }
    })();
  }, []);

  useEffect(() => {
    if (profileImg && !upload.isUploading) {
      setIsProfileImageLoading(true);
    } else if (!profileImg) {
      setIsProfileImageLoading(false);
    }
  }, [profileImg, upload.isUploading]);

  const handleUploadProgress = (snapshot: UploadTaskSnapshot) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log("Upload is " + progress + "% done");
    setUpload({ isUploading: true, uploadProgress: progress });
  };

  const handleUploadError = (error: Error) => {
    console.log("Error uploading image:", error);
    Alert.alert("Upload failed", "Failed to upload image. Please try again.");
    setUpload({ isUploading: false, uploadProgress: 0 });
    setIsProfileImageLoading(false);
  };

  const handleUploadComplete = (uploadTask: UploadTask) => {
    getDownloadURL(uploadTask.snapshot.ref)
      .then((downloadURL) => {
        authContext.updateProfileImage(downloadURL);
        setUpload({ isUploading: false, uploadProgress: 0 });
      })
      .catch((error) => {
        console.error("Error getting download URL:", error);
        Alert.alert(
          "Upload failed",
          "Failed to get image URL. Please try again.",
        );
        setUpload({ isUploading: false, uploadProgress: 0 });
        setIsProfileImageLoading(false);
      });
  };

  const monitorFileUpload = (uploadTask: UploadTask) => {
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
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setUpload({ isUploading: true, uploadProgress: 0 });

        const { blob, metadata } = await getImageBlobAndMetadata(
          result.assets[0].uri,
        );

        const uploadTask = uploadImage(userData.id, blob, metadata);
        monitorFileUpload(uploadTask);
      }
    } catch (error) {
      console.error("Error in useImagePicker:", error);
      Alert.alert(
        "Image Selection Failed",
        "Could not select image. Please try again.",
      );
      setUpload({ isUploading: false, uploadProgress: 0 });
      setIsProfileImageLoading(false);
    }
  };

  const getImageBlobAndMetadata = async (uri: string) => {
    const response = await fetch(uri);
    if (!response.ok) {
      throw new Error(`Failed to fetch resource: ${response.statusText}`);
    }
    const blob = await response.blob();
    const metadata = { contentType: "image/jpeg" };

    return { blob, metadata };
  };

  const deleteProfileImg = () => {
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete your profile picture?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: () => authContext.deleteImage(userData.id),
          style: "destructive",
        },
      ],
    );
  };

  return (
    <View style={[styles.profile, { backgroundColor: theme.primary }]}>
      <TouchableOpacity onPress={useImagePicker}>
        <View style={styles.pictureContainer}>
          {upload.isUploading ? (
            <View style={styles.progressContainer}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.profileField}>
                Uploading: {upload.uploadProgress.toFixed(0)}%
              </Text>
            </View>
          ) : profileImg ? (
            <>
              {isProfileImageLoading && (
                <View style={styles.activityIndicatorOverlay}>
                  <ActivityIndicator size="large" color={theme.text} />
                </View>
              )}
              <Image
                source={{ uri: profileImg }}
                style={styles.picture}
                onLoadEnd={() => setIsProfileImageLoading(false)}
                onError={(e) => {
                  console.error(
                    "Failed to load profile image:",
                    e.nativeEvent.error,
                  );
                  setIsProfileImageLoading(false);
                }}
              />
              {!upload.isUploading && !isProfileImageLoading && (
                <DeleteIcon
                  style={styles.deleteIcon}
                  width={24}
                  height={24}
                  fill="#fff"
                  onPress={deleteProfileImg}
                />
              )}
            </>
          ) : (
            <UserIcon width={150} height={150} fill={theme.text} />
          )}
        </View>
      </TouchableOpacity>
      <Text style={[styles.profileField, { color: theme.text }]}>
        {userData.fullName}
      </Text>
      <Text style={[styles.profileField, { color: theme.text }]}>
        {userData.email}
      </Text>
    </View>
  );
};

export default Profile;
