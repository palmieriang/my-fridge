import AppTutorialCoachmark from "@components/AppTutorialCoachmark/AppTutorialCoachmark";
import FloatingButton from "@components/FloatingButton/FloatingButton";
import { OfflineIndicator } from "@components/OfflineIndicator/OfflineIndicator";
import ProductCard from "@components/ProductCard/ProductCard";
import SearchBar from "@components/SearchBar/SearchBar";
import SortButton from "@components/SortButton/SortButton";
import { useFocusEffect } from "@react-navigation/native";
import {
  ElementRef,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Alert,
  FlatList,
  InteractionManager,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SwipeableMethods } from "react-native-gesture-handler/ReanimatedSwipeable";

import styles from "./styles";
import { FRIDGE } from "../../constants";
import {
  ProductListNavigationProp,
  ProductListRouteProp,
} from "../../navigation/navigation.d";
import { useAppTutorial, useLocale, useProducts, useTheme } from "../../store";
import { convertToISODateString } from "../../utils";
import { measureViewInWindow, MeasuredRect } from "../../utils/layout";

type ProductListProps = {
  navigation: ProductListNavigationProp;
  route: ProductListRouteProp;
};

const APP_TUTORIAL_TOTAL_STEPS = 7;
const LIST_ADD_BUTTON_STEP = 0;
const LIST_SWIPE_STEP = 5;
const LIST_DONE_STEP = 6;

const ProductList = ({ navigation, route }: ProductListProps) => {
  const { t } = useLocale();
  const { theme } = useTheme();
  const { fridgeProducts, freezerProducts } = useProducts();
  const { appTutorialState, appTutorialContext } = useAppTutorial();

  const { place } = route.params;

  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"default" | "earlier" | "later">(
    "default",
  );
  const [layoutRevision, setLayoutRevision] = useState(0);

  const filteredList = place === FRIDGE ? fridgeProducts : freezerProducts;

  const searchFilteredList = filteredList.filter((product) =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const sortedList = [...searchFilteredList].sort((a, b) => {
    if (sortOrder === "default") {
      return 0;
    }

    const dateA = new Date(convertToISODateString(a.date));
    const dateB = new Date(convertToISODateString(b.date));

    if (sortOrder === "earlier") {
      return dateA.getTime() - dateB.getTime();
    } else {
      return dateB.getTime() - dateA.getTime();
    }
  });

  useEffect(() => {
    swipeableRefs.current = swipeableRefs.current.slice(0, sortedList.length);
  }, [sortedList.length]);

  const swipeableRefs = useRef<(SwipeableMethods | null)[]>([]);
  const addButtonRef = useRef<ElementRef<typeof TouchableOpacity> | null>(null);
  const resumePromptShownRef = useRef(false);
  const [addButtonRect, setAddButtonRect] = useState<MeasuredRect | null>(null);

  const tutorialStep = appTutorialState.currentStep;
  const isFridgeList = place === FRIDGE;
  const isTutorialVisibleOnList =
    isFridgeList &&
    appTutorialState.isActive &&
    [LIST_ADD_BUTTON_STEP, LIST_SWIPE_STEP, LIST_DONE_STEP].includes(
      tutorialStep,
    );

  useFocusEffect(
    useCallback(() => {
      if (!isTutorialVisibleOnList || tutorialStep !== LIST_ADD_BUTTON_STEP) {
        return;
      }

      setAddButtonRect(null);
      let frameId: number | null = null;
      const interactionTask = InteractionManager.runAfterInteractions(() => {
        frameId = requestAnimationFrame(() => {
          measureViewInWindow(addButtonRef, setAddButtonRect);
        });
      });

      return () => {
        interactionTask.cancel();
        if (frameId !== null) {
          cancelAnimationFrame(frameId);
        }
      };
    }, [isTutorialVisibleOnList, layoutRevision, tutorialStep]),
  );

  const handleAddProduct = () => {
    navigateToProductForm({
      title: t("addItem"),
    });
  };

  const handleSortToggle = () => {
    const nextOrder = {
      default: "earlier",
      earlier: "later",
      later: "default",
    } as const;
    setSortOrder(nextOrder[sortOrder]);
  };

  const navigateToProductForm = (params: {
    title: string;
    tutorialMode?: boolean;
  }) => {
    navigation.navigate("form", params);
  };

  useFocusEffect(
    useCallback(() => {
      if (!isFridgeList || appTutorialState.loading) {
        return;
      }

      if (appTutorialState.isManualStartRequested) {
        appTutorialContext.restartTutorial();
        return;
      }

      if (
        appTutorialState.hasCompleted ||
        appTutorialState.hasDismissed ||
        appTutorialState.isActive
      ) {
        return;
      }

      if (appTutorialState.shouldShowResumePrompt) {
        if (resumePromptShownRef.current) {
          return;
        }

        resumePromptShownRef.current = true;

        Alert.alert(
          t("appTutorialResumeTitle"),
          t("appTutorialResumeMessage").replace(
            "{step}",
            String(appTutorialState.currentStep + 1),
          ),
          [
            {
              text: t("cancel"),
              style: "cancel",
              onPress: appTutorialContext.postponeTutorial,
            },
            {
              text: t("appTutorialRestart"),
              onPress: () => {
                appTutorialContext.restartTutorial();
              },
            },
            {
              text: t("appTutorialResume"),
              onPress: () => {
                appTutorialContext.resumeTutorial();
              },
            },
          ],
        );

        return;
      }

      appTutorialContext.startTutorial();

      return () => {
        resumePromptShownRef.current = false;
      };
    }, [
      appTutorialContext,
      appTutorialState.currentStep,
      appTutorialState.hasCompleted,
      appTutorialState.hasDismissed,
      appTutorialState.isActive,
      appTutorialState.isManualStartRequested,
      appTutorialState.loading,
      appTutorialState.shouldShowResumePrompt,
      isFridgeList,
      t,
    ]),
  );

  useEffect(() => {
    if (!isFridgeList || !appTutorialState.isActive) {
      return;
    }

    if (tutorialStep >= 1 && tutorialStep <= 4) {
      navigateToProductForm({
        title: t("addItem"),
        tutorialMode: true,
      });
    }
  }, [appTutorialState.isActive, isFridgeList, t, tutorialStep]);

  const handleTutorialSkip = () => {
    appTutorialContext.dismissTutorial();
  };

  const handleTutorialNext = () => {
    if (tutorialStep === LIST_ADD_BUTTON_STEP) {
      appTutorialContext.goToStep(1);
      return;
    }

    if (tutorialStep === LIST_SWIPE_STEP) {
      appTutorialContext.goToStep(LIST_DONE_STEP);
      return;
    }

    if (tutorialStep === LIST_DONE_STEP) {
      appTutorialContext.completeTutorial();
    }
  };

  const handleTutorialBack = () => {
    if (tutorialStep === LIST_SWIPE_STEP) {
      appTutorialContext.goToStep(3);
      return;
    }

    if (tutorialStep === LIST_DONE_STEP) {
      appTutorialContext.goToStep(LIST_SWIPE_STEP);
    }
  };

  const tutorialCopy = useMemo(() => {
    if (tutorialStep === LIST_ADD_BUTTON_STEP) {
      return {
        title: t("appTutorialStepAddTitle"),
        description: t("appTutorialStepAddDescription"),
        targetRect: addButtonRect,
        isLastStep: false,
      };
    }

    if (tutorialStep === LIST_SWIPE_STEP) {
      return {
        title: t("appTutorialStepSwipeTitle"),
        description: t("appTutorialStepSwipeNoFocusDescription"),
        targetRect: null,
        isLastStep: false,
      };
    }

    return {
      title: t("appTutorialStepDoneTitle"),
      description: t("appTutorialStepDoneDescription"),
      targetRect: null,
      isLastStep: true,
    };
  }, [addButtonRect, t, tutorialStep]);

  useEffect(() => {
    const unsubscribe = navigation.addListener("blur", () => {
      swipeableRefs.current.forEach((ref) => ref?.close());
      setSearchQuery("");
    });

    return unsubscribe;
  }, [navigation]);

  return (
    <View
      style={{ flex: 1, backgroundColor: theme.background }}
      onLayout={() => setLayoutRevision((revision) => revision + 1)}
    >
      <OfflineIndicator />
      <View style={styles.controlsContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder={t("search")}
        />
        <SortButton sortOrder={sortOrder} onSortToggle={handleSortToggle} />
      </View>

      {sortOrder !== "default" && (
        <View
          style={[styles.sortIndicator, { backgroundColor: theme.foreground }]}
        >
          <Text style={[styles.sortIndicatorText, { color: theme.text }]}>
            {sortOrder === "earlier" && t("sortEarlier")}
            {sortOrder === "later" && t("sortLater")}
          </Text>
        </View>
      )}

      {sortedList.length > 0 ? (
        <FlatList
          key="list"
          style={[styles.list, { backgroundColor: theme.background }]}
          data={sortedList}
          renderItem={({ item, index }) => (
            <ProductCard
              product={item}
              ref={(el) => {
                swipeableRefs.current[index] = el;
              }}
            />
          )}
          keyExtractor={(item) => item.id}
        />
      ) : filteredList.length > 0 ? (
        <Text style={[styles.noResultsText, { color: theme.text }]}>
          {t("noSearchResults")}
        </Text>
      ) : (
        <Text style={[styles.text, { color: theme.text }]}>{t("error")}</Text>
      )}

      <FloatingButton
        ref={addButtonRef}
        onPress={handleAddProduct}
        color={theme.primary}
      />

      <AppTutorialCoachmark
        visible={isTutorialVisibleOnList}
        title={tutorialCopy.title}
        description={tutorialCopy.description}
        targetRect={tutorialCopy.targetRect}
        stepNumber={tutorialStep + 1}
        totalSteps={APP_TUTORIAL_TOTAL_STEPS}
        onNext={handleTutorialNext}
        onBack={
          tutorialStep === LIST_ADD_BUTTON_STEP ? undefined : handleTutorialBack
        }
        onSkip={handleTutorialSkip}
        isLastStep={tutorialCopy.isLastStep}
        backLabel={t("appTutorialBack")}
        skipLabel={t("appTutorialSkip")}
        nextLabel={t("appTutorialNext")}
        doneLabel={t("appTutorialDone")}
        highlightPadding={6}
      />
    </View>
  );
};

export default ProductList;
