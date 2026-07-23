import { FC, useCallback, useMemo, useRef, useState } from "react";
import { Text, TouchableOpacity, View } from "react-native";

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
  const rootRef = useRef<View | null>(null);
  const [rootLayout, setRootLayout] = useState({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  });
  const { width: screenWidth, height: screenHeight } = rootLayout;

  const measureRoot = useCallback(() => {
    rootRef.current?.measureInWindow((x, y, width, height) => {
      setRootLayout({ x, y, width, height });
    });
  }, []);

  const cardWidth = Math.min(screenWidth - SPACING * 2, 360);

  const localTargetRect = useMemo(() => {
    if (!targetRect || screenWidth <= 0 || screenHeight <= 0) {
      return null;
    }

    return {
      ...targetRect,
      x: targetRect.x - rootLayout.x,
      y: targetRect.y - rootLayout.y,
    };
  }, [rootLayout.x, rootLayout.y, screenHeight, screenWidth, targetRect]);

  const tooltipPosition = useMemo(() => {
    if (!localTargetRect) {
      return {
        top: screenHeight * 0.34,
        left: (screenWidth - cardWidth) / 2,
      };
    }

    const candidateBelow = localTargetRect.y + localTargetRect.height + SPACING;
    const candidateAbove = localTargetRect.y - 200 - SPACING;

    const top =
      candidateBelow + 220 < screenHeight
        ? candidateBelow
        : Math.max(SPACING, candidateAbove);

    const centeredLeft =
      localTargetRect.x + localTargetRect.width / 2 - cardWidth / 2;
    const left = Math.max(
      SPACING,
      Math.min(centeredLeft, screenWidth - cardWidth - SPACING),
    );

    return { top, left };
  }, [cardWidth, localTargetRect, screenHeight, screenWidth]);

  const highlightRect = useMemo(() => {
    if (!localTargetRect) {
      return null;
    }

    const left = Math.max(0, localTargetRect.x - highlightPadding);
    const top = Math.max(0, localTargetRect.y - highlightPadding);
    const right = Math.min(
      screenWidth,
      localTargetRect.x + localTargetRect.width + highlightPadding,
    );
    const bottom = Math.min(
      screenHeight,
      localTargetRect.y + localTargetRect.height + highlightPadding,
    );

    return {
      left,
      top,
      width: Math.max(0, right - left),
      height: Math.max(0, bottom - top),
    };
  }, [highlightPadding, localTargetRect, screenHeight, screenWidth]);

  if (!visible) {
    return null;
  }

  return (
    <View
      ref={rootRef}
      pointerEvents="box-none"
      style={styles.modalRoot}
      onLayout={measureRoot}
      accessibilityViewIsModal={true}
    >
      {highlightRect ? (
        <>
          <View style={[styles.overlayPanel, { height: highlightRect.top }]} />
          <View
            style={[
              styles.overlayPanel,
              {
                top: highlightRect.top,
                width: highlightRect.left,
                height: highlightRect.height,
              },
            ]}
          />
          <View
            style={[
              styles.overlayPanel,
              {
                top: highlightRect.top,
                left: highlightRect.left + highlightRect.width,
                right: 0,
                height: highlightRect.height,
              },
            ]}
          />
          <View
            style={[
              styles.overlayPanel,
              { top: highlightRect.top + highlightRect.height, bottom: 0 },
            ]}
          />
        </>
      ) : (
        <View style={styles.overlay} />
      )}

      {highlightRect ? (
        <View
          pointerEvents="none"
          style={[styles.highlightBox, highlightRect]}
        />
      ) : null}

      {screenWidth > 0 && screenHeight > 0 ? (
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
          accessibilityLiveRegion="polite"
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
      ) : null}
    </View>
  );
};

export default AppTutorialCoachmark;
