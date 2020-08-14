import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, Modal, ScrollView } from 'react-native';
import { RNCamera } from 'react-native-camera';

const CameraRecognition = ({ navigation }) => {
    const [text, setText] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);

    const { height, width } = Dimensions.get('window');

    const takePicture = async () => {
        const options = { quality: 0.8, base64: true, skipProcessing: true, forceUpOrientation: true };
        const data = await camera.takePictureAsync(options);

        // for on-device (Supports Android and iOS)

        const deviceTextRecognition = await RNMlKit.deviceTextRecognition(data.uri); 
        console.log('Text Recognition On-Device', deviceTextRecognition);

        setText(deviceTextRecognition);
        setModalVisible(true);

        // alert('Texto identificado ' + JSON.stringify(deviceTextRecognition))

        // for cloud (At the moment supports only Android)

        // const cloudTextRecognition = await RNMlKit.cloudTextRecognition(data.uri);
        // console.log('Text Recognition Cloud', cloudTextRecognition);
    };

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
        <View>
            <RNCamera
                ref={camera => {
                    this.camera = camera;
                }}
                style = {styles.preview}
                type={RNCamera.Constants.Type.back}
                autoFocus={RNCamera.Constants.AutoFocus.on}
                flashMode={RNCamera.Constants.FlashMode.off}
                captureAudio={false}
                permissionDialogTitle={"Permission to use camera"}
                permissionDialogMessage={
                    "We need your permission to use your camera phone"
                }
            />
            {renderModal()}
            <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={takePicture} style={styles.capture}>
                    <Text style={styles.buttonText}> SNAP </Text>
                </TouchableOpacity>
            </View>
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
