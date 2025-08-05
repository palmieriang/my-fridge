import { StyleSheet } from "react-native";

import { Typography } from "../../typography/responsive";
import { responsive } from "../../utils/responsive";

export default StyleSheet.create({
  list: {
    flex: 1,
    paddingTop: 10,
  },
  text: {
    height: 50,
    margin: 0,
    marginRight: 7,
    paddingLeft: 20,
    marginTop: 20,
  },
  controlsContainer: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: responsive.containerMargin,
    paddingTop: 10,
    paddingBottom: 5,
    gap: 8,
  },
  searchContainer: {
    flex: 1,
    position: "relative",
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    height: 48,
    borderRadius: 4,
    paddingHorizontal: 15,
    paddingRight: 45,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
  },
  clearButton: {
    position: "absolute",
    right: 12,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: "#ccc",
    justifyContent: "center",
    alignItems: "center",
  },
  clearButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
  },
  sortButton: {
    width: 48,
    height: 48,
    borderRadius: 4,
    backgroundColor: "#f0f0f0",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e0e0e0",
  },
  sortButtonText: {
    fontSize: 18,
  },
  sortIndicator: {
    paddingHorizontal: responsive.containerPadding,
    paddingVertical: 8,
    backgroundColor: "#f8f8f8",
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
  },
  sortIndicatorText: {
    fontSize: Typography.caption,
    fontFamily: "OpenSans-Regular",
    textAlign: "center",
    fontStyle: "italic",
  },
  noResultsText: {
    textAlign: "center",
    fontSize: Typography.body,
    fontFamily: "OpenSans-Regular",
    marginTop: 50,
    paddingHorizontal: 20,
  },
});
