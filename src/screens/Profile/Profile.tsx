import Loading from "@components/Loading/Loading";
import DeleteIcon from "@components/svg/DeleteIcon";
import UserIcon from "@components/svg/UserIcon";
import type { FirebaseStorageTypes } from "@react-native-firebase/storage";
import * as ImagePicker from "expo-image-picker";
import { useContext, useState, useEffect } from "react";
import {
  Alert,
  Image,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { COLORS } from "src/constants/colors";

import { getImageBlobAndMetadata } from "./getImageBlobAndMetadata";
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

  const handleUploadProgress = (
    snapshot: FirebaseStorageTypes.TaskSnapshot,
  ) => {
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    setUpload({ isUploading: true, uploadProgress: progress });
  };

  const resetState = () => {
    setUpload({ isUploading: false, uploadProgress: 0 });
    setIsProfileImageLoading(false);
  };

  const handleUploadError = (error: Error) => {
    console.log("Error uploading image:", error);
    Alert.alert("Upload failed", "Failed to upload image. Please try again.");
    resetState();
  };

  const handleUploadComplete = async (
    uploadTask: FirebaseStorageTypes.Task,
  ) => {
    if (uploadTask.snapshot === null) {
      resetState();
      return;
    }

    try {
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
      authContext.updateProfileImage(downloadURL);
    } catch (error) {
      console.error("Error getting download URL:", error);
      Alert.alert(
        "Upload failed",
        "Failed to get image URL. Please try again.",
      );
    } finally {
      resetState();
    }
  };

  const monitorFileUpload = (uploadTask: FirebaseStorageTypes.Task) => {
    uploadTask.on(
      "state_changed",
      handleUploadProgress,
      handleUploadError,
      () => handleUploadComplete(uploadTask),
    );
  };

  const handleImagePicker = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images",
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (result.canceled || !result.assets?.[0]?.uri) {
        console.log("Image selection was canceled or no image was selected.");
        return;
      }

      setUpload({ isUploading: true, uploadProgress: 0 });

      const uri = result.assets[0].uri;
      const { metadata } = await getImageBlobAndMetadata(uri);

      const uploadTask = uploadImage(userData.id, uri, metadata);

      monitorFileUpload(uploadTask);
    } catch (error) {
      console.error("Error in handleImagePicker:", error);
      Alert.alert(
        "Image Selection Failed",
        "Could not select image. Please try again.",
      );
      resetState();
    }
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
      <TouchableOpacity onPress={handleImagePicker}>
        <View style={styles.pictureContainer}>
          {upload.isUploading ? (
            <View style={styles.progressContainer}>
              <Loading size="large" color={COLORS.WHITE} />
              <Text style={styles.profileField}>
                Uploading: {upload.uploadProgress.toFixed(0)}%
              </Text>
            </View>
          ) : profileImg ? (
            <>
              {isProfileImageLoading && (
                <Loading
                  size="large"
                  color={COLORS.WHITE}
                  style={styles.activityIndicatorOverlay}
                />
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
                  fill={COLORS.WHITE}
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
