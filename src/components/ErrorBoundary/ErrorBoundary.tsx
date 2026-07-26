import { Component, ReactNode } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path, G } from "react-native-svg";

import { COLORS } from "../../constants/colors";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

const WarningIcon = () => (
  <Svg width={64} height={64} viewBox="0 0 24 24" fill="none">
    <Path
      d="M12 2L1 21h22L12 2z"
      stroke={COLORS.PRIMARY_RED}
      strokeWidth={1.5}
      strokeLinejoin="round"
      fill="none"
    />
    <Path
      d="M12 9v5"
      stroke={COLORS.PRIMARY_RED}
      strokeWidth={1.5}
      strokeLinecap="round"
    />
    <Path
      d="M12 17.5v.5"
      stroke={COLORS.PRIMARY_RED}
      strokeWidth={2}
      strokeLinecap="round"
    />
  </Svg>
);

const RetryIcon = () => (
  <Svg width={28} height={28} viewBox="0 0 24 24" fill="none">
    <G>
      <Path
        d="M4 12a8 8 0 018-8 8 8 0 017.32 4.77"
        stroke={COLORS.WHITE}
        strokeWidth={2}
        strokeLinecap="round"
      />
      <Path
        d="M19 4v4h-4"
        stroke={COLORS.WHITE}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </G>
  </Svg>
);

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.error("ErrorBoundary caught:", error);
  }

  handleReset = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <View style={styles.container}>
          <WarningIcon />
          <TouchableOpacity
            style={styles.button}
            onPress={this.handleReset}
            accessibilityRole="button"
            accessibilityLabel="Retry"
          >
            <RetryIcon />
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 32,
    backgroundColor: COLORS.WHITE,
  },
  button: {
    padding: 16,
    borderRadius: 50,
    backgroundColor: COLORS.PRIMARY_BLUE,
  },
});

export default ErrorBoundary;
