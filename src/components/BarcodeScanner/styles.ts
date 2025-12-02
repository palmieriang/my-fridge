import { StyleSheet } from "react-native";

import { COLORS } from "../../constants/colors";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.DARK_BACKGROUND,
  },
  centeredContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: COLORS.WHITE,
  },
  permissionText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 20,
    color: COLORS.DARK_FOREGROUND,
  },
  button: {
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    marginVertical: 8,
    minWidth: 200,
    alignItems: "center",
  },
  buttonText: {
    color: COLORS.WHITE,
    fontSize: 16,
    fontWeight: "600",
  },
  cancelButton: {
    backgroundColor: COLORS.MEDIUM_DARK_GRAY,
  },
  cancelButtonText: {
    color: COLORS.DARK_FOREGROUND,
    fontSize: 16,
    fontWeight: "600",
  },
  cameraContainer: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "space-between",
  },
  header: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    paddingTop: 60,
    alignItems: "center",
  },
  headerText: {
    color: COLORS.WHITE,
    fontSize: 20,
    fontWeight: "bold",
  },
  scanArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  scanFrame: {
    width: 280,
    height: 150,
    borderWidth: 2,
    borderColor: COLORS.WHITE,
    borderRadius: 12,
    backgroundColor: "transparent",
  },
  footer: {
    backgroundColor: "rgba(0,0,0,0.6)",
    padding: 20,
    paddingBottom: 40,
    alignItems: "center",
  },
  instructionText: {
    color: COLORS.WHITE,
    fontSize: 14,
    marginBottom: 16,
    textAlign: "center",
  },
  closeButton: {
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
});
