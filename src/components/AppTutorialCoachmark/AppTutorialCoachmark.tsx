import { FC, useMemo } from "react";
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";

import { styles } from "./styles";
import { useTheme } from "../../store";

type TargetRect = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type AppTutorialCoachmarkProps = {
  visible: boolean;
  title: string;
  description: string;
  stepNumber: number;
  totalSteps: number;
  onNext: () => void;
  onBack?: () => void;
  onSkip: () => void;
  isLastStep?: boolean;
  targetRect?: TargetRect | null;
  backLabel: string;
  skipLabel: string;
  nextLabel: string;
  doneLabel: string;
  highlightPadding?: number;
};

const SPACING = 16;
const DEFAULT_HIGHLIGHT_PADDING = 8;

const AppTutorialCoachmark: FC<AppTutorialCoachmarkProps> = ({
  visible,
  title,
  description,
  stepNumber,
  totalSteps,
  onNext,
  onBack,
  onSkip,
  isLastStep = false,
  targetRect,
  backLabel,
  skipLabel,
  nextLabel,
  doneLabel,
  highlightPadding = DEFAULT_HIGHLIGHT_PADDING,
}) => {
  const { theme } = useTheme();
  const { width: screenWidth, height: screenHeight } = useWindowDimensions();

  const cardWidth = Math.min(screenWidth - SPACING * 2, 360);

  const tooltipPosition = useMemo(() => {
    if (!targetRect) {
      return {
        top: screenHeight * 0.34,
        left: (screenWidth - cardWidth) / 2,
      };
    }

    const candidateBelow = targetRect.y + targetRect.height + SPACING;
    const candidateAbove = targetRect.y - 200 - SPACING;

    const top =
      candidateBelow + 220 < screenHeight
        ? candidateBelow
        : Math.max(SPACING, candidateAbove);

    const centeredLeft = targetRect.x + targetRect.width / 2 - cardWidth / 2;
    const left = Math.max(
      SPACING,
      Math.min(centeredLeft, screenWidth - cardWidth - SPACING),
    );

    return { top, left };
  }, [cardWidth, screenHeight, screenWidth, targetRect]);

  const highlightStyle = useMemo(() => {
    if (!targetRect) {
      return null;
    }

    return {
      left: Math.max(0, targetRect.x - highlightPadding),
      top: Math.max(0, targetRect.y - highlightPadding),
      width: targetRect.width + highlightPadding * 2,
      height: targetRect.height + highlightPadding * 2,
      backgroundColor: "transparent",
    };
  }, [highlightPadding, targetRect]);

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onSkip}
    >
      <View style={styles.modalRoot}>
        <View style={styles.overlay} />

        {highlightStyle ? (
          <View
            pointerEvents="none"
            style={[styles.highlightBox, highlightStyle]}
          />
        ) : null}

        <View
          style={[
            styles.tooltip,
            {
              width: cardWidth,
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              backgroundColor: theme.foreground,
            },
          ]}
        >
          <Text style={[styles.title, { color: theme.text }]}>{title}</Text>
          <Text style={[styles.description, { color: theme.text }]}>
            {description}
          </Text>

          <Text style={[styles.stepLabel, { color: theme.text }]}>
            {stepNumber}/{totalSteps}
          </Text>

          <View style={styles.controlsRow}>
            <View style={styles.sideControls}>
              {onBack ? (
                <TouchableOpacity
                  onPress={onBack}
                  style={styles.controlButton}
                  accessibilityRole="button"
                >
                  <Text style={[styles.controlLabel, { color: theme.text }]}>
                    {backLabel}
                  </Text>
                </TouchableOpacity>
              ) : null}

              <TouchableOpacity
                onPress={onSkip}
                style={styles.controlButton}
                accessibilityRole="button"
              >
                <Text style={[styles.controlLabel, { color: theme.text }]}>
                  {skipLabel}
                </Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              onPress={onNext}
              style={styles.controlButton}
              accessibilityRole="button"
            >
              <Text style={[styles.controlLabel, { color: theme.primary }]}>
                {isLastStep ? doneLabel : nextLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default AppTutorialCoachmark;
