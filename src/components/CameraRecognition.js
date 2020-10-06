import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView, Platform } from 'react-native';
import { Camera } from 'expo-camera';
// import { RNCamera } from 'react-native-camera';
// import { utils } from '@react-native-firebase/app';
// import vision from '@react-native-firebase/ml-vision';

const CameraRecognition = () => {
  const [text, setText] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const { height, width } = Dimensions.get('window');

  const cameraRef = useRef(null);

  const [hasPermission, setHasPermission] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  const takePicture = async () => {
    const options = { quality: 0.5, base64: true };
    if (cameraRef) {
      // const data = await cameraRef.current.takePictureAsync(options);
      const data = await cameraRef.current.takePictureAsync();
      console.log(data);
    }
  };

  // const takePicture = async () => {
  //     const options = { quality: 0.8, base64: true, skipProcessing: true, forceUpOrientation: true };
  //     const data = await cameraRef.current.takePictureAsync(options);

  //     // for on-device (Supports Android and iOS)

  //     const deviceTextRecognition = await RNMlKit.deviceTextRecognition(data.uri); 
  //     console.log('Text Recognition On-Device', deviceTextRecognition);

  //     setText(deviceTextRecognition);
  //     setModalVisible(true);

  //     // alert('Texto identificado ' + JSON.stringify(deviceTextRecognition))

  //     // for cloud (At the moment supports only Android)

  //     // const cloudTextRecognition = await RNMlKit.cloudTextRecognition(data.uri);
  //     // console.log('Text Recognition Cloud', cloudTextRecognition);
  // };

  async function processDocument(localPath) {
    const processed = await vision().textRecognizerProcessImage(localPath);

    console.log('Found text in document: ', processed.text);

    processed.blocks.forEach(block => {
      console.log('Found block with text: ', block.text);
      console.log('Confidence in block: ', block.confidence);
      console.log('Languages found in block: ', block.recognizedLanguages);
    });
  }

  const PendingView = () => (
    <View
      style={{
        flex: 1,
        backgroundColor: 'lightgreen',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <Text>Waiting</Text>
    </View>
  );

  const handleCancel = () => {
    setModalVisible(false);
  };

  const renderModal = () => {
    return (
      <Modal animationType="slide" transparent={false} visible={modalVisible}>
        <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
          <View style={{ width: width - 50, height: height - 70 }}>
            <ScrollView>
                {text.map(blockVision => (
                  <View style={styles.textContainer} key={blockVision.lineText}>
                    <Text>Element Text : {blockVision.elementText}</Text>
                    <Text>Line Text : {blockVision.lineText}</Text>
                    <Text>Result Text : {blockVision.resultText}</Text>
                    <Text>Block Text : {blockVision.blockText}</Text>
                  </View>
                ))}
            </ScrollView>
          </View>
          <TouchableOpacity onPress={handleCancel}>
            <Text>Fechar</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <View style={{ flex: 1 }}>

      <Camera
        ref={cameraRef}
        style={{ flex: 1 }}
        type={type}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'transparent',
            flexDirection: 'row',
            justifyContent: 'space-around',
          }}>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={() => {
              setType(
                type === Camera.Constants.Type.back
                  ? Camera.Constants.Type.front
                  : Camera.Constants.Type.back
              );
            }}>
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Flip </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={{
              flex: 0.1,
              alignSelf: 'flex-end',
              alignItems: 'center',
            }}
            onPress={takePicture}
            >
            <Text style={{ fontSize: 18, marginBottom: 10, color: 'white' }}> Snap </Text>
          </TouchableOpacity>
        </View>
      </Camera>

      {renderModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  preview: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  capture: {
    alignSelf: 'center',
    backgroundColor: '#fff',
    borderRadius: 5,
    flex: 0,
    padding: 15,
    paddingHorizontal: 20,
    margin: 20,
  },
  buttonText: {
    fontSize: 14,
  },
  textContainer: {
    marginBottom: 30,
  },
  modalView: {
    alignItems: 'center',
    backgroundColor: '#FFF',
    justifyContent: 'center',
  },
});

export default CameraRecognition;
