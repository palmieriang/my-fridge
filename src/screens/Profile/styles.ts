import { StyleSheet } from "react-native";
import { COLORS } from "src/constants/colors";

import { Typography } from "../../typography/responsive";

const AVATAR_SIZE = 56;

export default StyleSheet.create({
  profile: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    width: "100%",
  },
  avatarWrapper: {
    marginRight: 14,
  },
  pictureContainer: {
    width: AVATAR_SIZE,
    height: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.15)",
  },
  picture: {
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
    borderRadius: AVATAR_SIZE / 2,
  },
  activityIndicatorOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
    borderRadius: AVATAR_SIZE / 2,
    zIndex: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "center",
  },
  nameText: {
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.bodyLarge,
    color: COLORS.WHITE,
  },
  emailText: {
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    color: COLORS.WHITE,
    opacity: 0.75,
    marginTop: 2,
  },
  uploadText: {
    color: COLORS.WHITE,
    fontFamily: "OpenSans-Regular",
    fontSize: Typography.caption,
    marginTop: 4,
    textAlign: "center",
  },
  progressContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  statsContainer: {
    flexDirection: "row" as const,
    alignItems: "center",
    gap: 8,
  },
  statBadge: {
    flexDirection: "row" as const,
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 20,
    paddingVertical: 5,
    paddingHorizontal: 10,
    gap: 5,
  },
  statEmoji: {
    fontSize: 14,
    lineHeight: 18,
  },
  statCount: {
    color: COLORS.WHITE,
    fontFamily: "OpenSans-Bold",
    fontSize: Typography.body,
    lineHeight: 18,
  },
  deleteBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: COLORS.PRIMARY_RED,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1.5,
    borderColor: COLORS.WHITE,
    zIndex: 10,
  },
  deleteBadgeText: {
    color: COLORS.WHITE,
    fontSize: 10,
    fontWeight: "700" as const,
    lineHeight: 13,
    includeFontPadding: false,
  },
});
