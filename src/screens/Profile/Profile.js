import DeleteIcon from "@components/svg/DeleteIcon";
import UserIcon from "@components/svg/UserIcon";
import Constants from "expo-constants";
import * as ImagePicker from "expo-image-picker";
import React, { useContext, useState, useEffect } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import Image from "react-native-image-progress";
import * as Progress from "react-native-progress";

import styles from "./styles";
import { uploadTaskFromApi } from "../../../api/api";
import { authStore, themeStore } from "../../store";

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
        const { status } =
          await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== "granted") {
          alert("Sorry, we need camera roll permissions to make this work!");
        }
      }
    })();
  }, []);

  const uploadProgress = (ratio) => Math.round(ratio * 100);

  const monitorFileUpload = (uploadTask) => {
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress = snapshot.bytesTransferred / snapshot.totalBytes;
        console.log("Upload is " + uploadProgress(progress) + "% done");

        setUpload({ loading: true, progress });

        switch (snapshot.state) {
          case "paused": // or firebase.storage.TaskState.PAUSED
            console.log("Upload is paused");
            break;
          case "running": // or firebase.storage.TaskState.RUNNING
            console.log("Upload is running");
            break;
        }
      },
      (error) => {
        console.log("Error: ", error);
      },
      () => {
        uploadTask.snapshot.ref.getDownloadURL().then((url) => {
          console.log("File available at", url);
          authContext.updateProfileImage(url);
          setUpload({ loading: false });
        });
      },
    );
  };

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
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
        xhr.responseType = "blob";
        xhr.open("GET", result.uri, true);
        xhr.send(null);
      });
      const metadata = {
        contentType: "image/jpeg",
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

export default Profile;
