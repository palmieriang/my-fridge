import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

export default StyleSheet.create({
  iconsContainer: {
    alignSelf: "center",
    alignItems: "center",
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 10,
    marginBottom: 50,
  },
  icons: {
    margin: 10,
  },
  googleButton: {
    backgroundColor: COLORS.WHITE,
    borderWidth: 1,
    borderColor: "#dadce0",
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 16,
    minWidth: 240,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },
  googleButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  googleIcon: {
    width: 20,
    height: 20,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  googleButtonText: {
    color: "#3c4043",
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "OpenSans-Medium",
  },
});
