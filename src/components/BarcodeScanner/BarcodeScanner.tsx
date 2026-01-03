import {
  CameraView,
  useCameraPermissions,
  BarcodeScanningResult,
  BarcodeType,
} from "expo-camera";
import { useState, useCallback } from "react";
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";

import { styles } from "./styles";
import { useLocale, useTheme } from "../../store";

const BARCODE_TYPES: BarcodeType[] = [
  "ean13",
  "ean8",
  "upc_a",
  "upc_e",
  "code128",
  "code39",
  "code93",
];

interface BarcodeScannerProps {
  visible: boolean;
  onClose: () => void;
  onBarcodeScanned: (barcode: string) => void;
}

export const BarcodeScanner = ({
  visible,
  onClose,
  onBarcodeScanned,
}: BarcodeScannerProps) => {
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const { t } = useLocale();
  const { theme } = useTheme();

  const handleBarCodeScanned = useCallback(
    (result: BarcodeScanningResult) => {
      if (scanned) return;
      setScanned(true);
      onBarcodeScanned(result.data);
    },
    [scanned, onBarcodeScanned],
  );

  const handleClose = useCallback(() => {
    setScanned(false);
    onClose();
  }, [onClose]);

  const handleRequestPermission = useCallback(async () => {
    await requestPermission();
  }, [requestPermission]);

  const handleModalShow = useCallback(() => {
    setScanned(false);
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      onRequestClose={handleClose}
      onShow={handleModalShow}
    >
      <View style={styles.container}>
        {!permission ? (
          <View style={styles.centeredContainer}>
            <ActivityIndicator size="large" color={theme.primary} />
          </View>
        ) : !permission.granted ? (
          <View style={styles.centeredContainer}>
            <Text style={styles.permissionText}>
              {t("cameraPermissionRequired")}
            </Text>
            <TouchableOpacity
              style={[styles.button, { backgroundColor: theme.primary }]}
              onPress={handleRequestPermission}
            >
              <Text style={styles.buttonText}>{t("grantPermission")}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.button, styles.cancelButton]}
              onPress={handleClose}
            >
              <Text style={styles.cancelButtonText}>{t("cancel")}</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.cameraContainer}>
            <CameraView
              style={styles.camera}
              facing="back"
              barcodeScannerSettings={{
                barcodeTypes: BARCODE_TYPES,
              }}
              onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
            />
            <View style={styles.overlay}>
              <View style={styles.header}>
                <Text style={styles.headerText}>{t("scanBarcode")}</Text>
              </View>
              <View style={styles.scanArea}>
                <View style={styles.scanFrame} />
              </View>
              <View style={styles.footer}>
                <Text style={styles.instructionText}>
                  {t("pointCameraAtBarcode")}
                </Text>
                <TouchableOpacity
                  style={[
                    styles.closeButton,
                    { backgroundColor: theme.primary },
                  ]}
                  onPress={handleClose}
                >
                  <Text style={styles.buttonText}>{t("cancel")}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

export default BarcodeScanner;
