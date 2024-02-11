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
