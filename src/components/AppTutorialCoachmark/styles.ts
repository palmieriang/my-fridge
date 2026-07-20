import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";

export const styles = StyleSheet.create({
  modalRoot: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
    elevation: 1000,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  overlayPanel: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0, 0, 0, 0.72)",
  },
  highlightBox: {
    position: "absolute",
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.9)",
  },
  tooltip: {
    position: "absolute",
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    maxWidth: 360,
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 4,
  },
  title: {
    fontFamily: "Nunito-Bold",
    fontSize: Typography.bodyLarge,
    marginBottom: 8,
  },
  description: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.body,
    lineHeight: 21,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 14,
  },
  sideControls: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  controlButton: {
    paddingVertical: 8,
    paddingHorizontal: 6,
  },
  controlLabel: {
    fontFamily: "OpenSans-SemiBold",
    fontSize: Typography.body,
    textTransform: "uppercase",
  },
  stepLabel: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    opacity: 0.9,
    marginTop: 8,
  },
});
