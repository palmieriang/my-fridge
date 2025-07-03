import { adjust } from "@components/utils/dimensions";
import { StyleSheet } from "react-native";

export default StyleSheet.create({
  profile: {
    alignItems: "center",
    paddingBottom: 30,
    width: "100%",
  },
  pictureContainer: {
    marginTop: 30,
  },
  picture: {
    height: 150,
    width: 150,
    borderRadius: 100,
    position: "relative",
  },
  activityIndicatorOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Dim background during any loading
    borderRadius: 75, // Match container radius
    zIndex: 2, // Ensure it's on top
  },
  profileField: {
    color: "#fff",
    fontFamily: "OpenSans-Regular",
    fontSize: adjust(13),
    marginTop: 20,
  },
  progressContainer: {
    flex: 1,
    justifyContent: "center",
    maxHeight: 150,
  },
  deleteIcon: {
    bottom: 0,
    position: "absolute",
    right: 0,
  },
});
