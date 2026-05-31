import { Text, View } from "react-native";

import styles from "./ExpiryStatus.styles";

type ExpiryStatusProps = {
  expired: boolean;
  days: number;
  expiredLabel: string;
  daysLabel: string;
  primaryColor: string;
  textColor: string;
};

const ExpiryStatus = ({
  expired,
  days,
  expiredLabel,
  daysLabel,
  primaryColor,
  textColor,
}: ExpiryStatusProps) => {
  if (expired) {
    return (
      <Text style={[styles.expired, { color: primaryColor }]}>
        {expiredLabel}
      </Text>
    );
  }

  return (
    <View style={styles.counterContainer}>
      <Text style={[styles.counterText, { color: primaryColor }]}>{days}</Text>
      <Text style={[styles.counterLabel, { color: textColor }]}>
        {daysLabel}
      </Text>
    </View>
  );
};

export default ExpiryStatus;
