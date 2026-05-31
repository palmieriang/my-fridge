import AppTutorialCoachmark from "@components/AppTutorialCoachmark/AppTutorialCoachmark";
import BarcodeScanner from "@components/BarcodeScanner/BarcodeScanner";
import Button from "@components/Button/Button";
import FormInput from "@components/FormInput/FormInput";
import { PlacePicker } from "@components/Picker/PlacePicker";
import BarcodeIcon from "@components/svg/BarcodeIcon";
import CalendarIcon from "@components/svg/CalendarIcon";
import FridgeIcon from "@components/svg/FridgeIcon";
import LayersIcon from "@components/svg/LayersIcon";
import ShoppingBasketIcon from "@components/svg/ShoppingBasketIcon";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  KeyboardAvoidingView,
  ScrollView,
  Platform,
  Text,
  useWindowDimensions,
  View,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import DateTimePickerModal from "react-native-modal-datetime-picker";

import { styles } from "./styles";
import { useProductForm } from "./useProductForm";
import { lookupProductByBarcode } from "../../../api/openFoodFacts";
import {
  FormScreenNavigationProp,
  FormScreenRouteProp,
} from "../../navigation/navigation.d";
import {
  useAppTutorial,
  useAuth,
  useLocale,
  useProducts,
  useTheme,
} from "../../store";
import { measureViewInWindow, MeasuredRect } from "../../utils/layout";
import { responsive } from "../../utils/responsive";

type ProductFormProps = {
  navigation: FormScreenNavigationProp;
  route: FormScreenRouteProp;
};

const ProductForm = ({ navigation, route }: ProductFormProps) => {
  const { params } = route;
  const { t } = useLocale();
  const { authState } = useAuth();
  const { appTutorialState, appTutorialContext } = useAppTutorial();
  const user = authState?.user;
  const { theme } = useTheme();
  const { productsContext } = useProducts();
  const { width: screenWidth } = useWindowDimensions();

  const [showScanner, setShowScanner] = useState(false);
  const [isLookingUp, setIsLookingUp] = useState(false);
  const productInputRef = useRef<View | null>(null);
  const dateInputRef = useRef<View | null>(null);
  const placePickerRef = useRef<View | null>(null);
  const saveButtonRef = useRef<TouchableOpacity | null>(null);

  const [productInputRect, setProductInputRect] = useState<MeasuredRect | null>(
    null,
  );
  const [dateInputRect, setDateInputRect] = useState<MeasuredRect | null>(null);
  const [placePickerRect, setPlacePickerRect] = useState<MeasuredRect | null>(
    null,
  );
  const [saveButtonRect, setSaveButtonRect] = useState<MeasuredRect | null>(
    null,
  );

  const normalizeFormTargetRect = useCallback(
    (rect: MeasuredRect | null): MeasuredRect | null => {
      if (!rect) {
        return null;
      }

      const desiredHeight = 56;
      const y = rect.y + Math.max(0, (rect.height - desiredHeight) / 2);

      return {
        x: responsive.containerMargin,
        y,
        width: Math.max(0, screenWidth - responsive.containerMargin * 2),
        height: desiredHeight,
      };
    },
    [screenWidth],
  );

  const tutorialStep = appTutorialState.currentStep;
  const isFormTutorialActive =
    params?.tutorialMode &&
    appTutorialState.isActive &&
    tutorialStep >= 1 &&
    tutorialStep <= 4;

  const navigateToList = () => {
    navigation.navigate("list" as never);
  };

  const {
    name,
    date,
    place,
    quantity,
    showDatePicker,
    errors,
    isSubmitting,
    isDeleting,
    initPickerDate,
    handleChangeName,
    handleDatePress,
    handleDatePicked,
    handleDatePickerHide,
    handlePlaceChange,
    handleChangeQuantity,
    handleSubmit,
    handleDelete,
  } = useProductForm({
    existingProduct: params.product,
    existingId: params?.id || "",
    userID: user?.uid ?? "",
    t,
    onSuccess: navigateToList,
    productsContext,
  });

  const handleOpenScanner = useCallback(() => {
    setShowScanner(true);
  }, []);

  const handleCloseScanner = useCallback(() => {
    setShowScanner(false);
  }, []);

  const handleBarcodeScanned = useCallback(
    async (barcode: string) => {
      setShowScanner(false);
      setIsLookingUp(true);

      try {
        const result = await lookupProductByBarcode(barcode);

        if (result.found && result.product) {
          handleChangeName(result.product.name);
          Alert.alert(
            t("productFound"),
            t("productFoundMessage").replace("{name}", result.product.name),
          );
        } else {
          Alert.alert(
            t("productNotFound"),
            t("productNotFoundMessage").replace("{barcode}", barcode),
            [{ text: t("ok"), style: "default" }],
          );
        }
      } catch (error) {
        console.error("[BarcodeScanner] Error:", error);
        Alert.alert(t("error"), t("barcodeLookupError"));
      } finally {
        setIsLookingUp(false);
      }
    },
    [handleChangeName, t],
  );

  useEffect(() => {
    if (!isFormTutorialActive) {
      return;
    }

    const updateLayout = () => {
      if (tutorialStep === 1) {
        measureViewInWindow(productInputRef, setProductInputRect);
      }

      if (tutorialStep === 2) {
        measureViewInWindow(dateInputRef, setDateInputRect);
      }

      if (tutorialStep === 3) {
        measureViewInWindow(placePickerRef, setPlacePickerRect);
      }

      if (tutorialStep === 4) {
        measureViewInWindow(saveButtonRef, setSaveButtonRect);
      }
    };

    requestAnimationFrame(updateLayout);
  }, [isFormTutorialActive, tutorialStep]);

  const handleTutorialSkip = () => {
    appTutorialContext.dismissTutorial();
    navigation.navigate("list", { place: "fridge" });
  };

  const handleTutorialNext = () => {
    if (tutorialStep === 1) {
      appTutorialContext.goToStep(2);
      return;
    }

    if (tutorialStep === 2) {
      appTutorialContext.goToStep(3);
      return;
    }

    if (tutorialStep === 3) {
      appTutorialContext.goToStep(4);
      return;
    }

    if (tutorialStep === 4) {
      appTutorialContext.goToStep(5);
      navigation.navigate("list", { place: "fridge" });
    }
  };

  const handleTutorialBack = () => {
    if (tutorialStep === 1) {
      appTutorialContext.goToStep(0);
      navigation.navigate("list", { place: "fridge" });
      return;
    }

    if (tutorialStep === 2) {
      appTutorialContext.goToStep(1);
      return;
    }

    if (tutorialStep === 3) {
      appTutorialContext.goToStep(2);
      return;
    }

    if (tutorialStep === 4) {
      appTutorialContext.goToStep(3);
    }
  };

  const tutorialCopy = useMemo(() => {
    if (tutorialStep === 1) {
      return {
        title: t("appTutorialStepNameTitle"),
        description: t("appTutorialStepNameDescription"),
        targetRect: normalizeFormTargetRect(productInputRect),
      };
    }

    if (tutorialStep === 2) {
      return {
        title: t("appTutorialStepDateTitle"),
        description: t("appTutorialStepDateDescription"),
        targetRect: normalizeFormTargetRect(dateInputRect),
      };
    }

    if (tutorialStep === 3) {
      return {
        title: t("appTutorialStepPlaceTitle"),
        description: t("appTutorialStepPlaceDescription"),
        targetRect: normalizeFormTargetRect(placePickerRect),
      };
    }

    return {
      title: t("appTutorialStepSaveTitle"),
      description: t("appTutorialStepSaveDescription"),
      targetRect: normalizeFormTargetRect(saveButtonRect),
    };
  }, [
    dateInputRect,
    normalizeFormTargetRect,
    placePickerRect,
    productInputRect,
    saveButtonRect,
    t,
    tutorialStep,
  ]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: theme.background }}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <ScrollView style={styles.container} keyboardShouldPersistTaps="handled">
        {!params?.id && (
          <View style={styles.scanButtonContainer}>
            {isLookingUp ? (
              <View style={styles.scanningContainer}>
                <ActivityIndicator size="small" color={theme.primary} />
                <Text style={[styles.scanningText, { color: theme.text }]}>
                  {t("lookingUpProduct")}
                </Text>
              </View>
            ) : (
              <TouchableOpacity
                style={[styles.scanButton, { borderColor: theme.primary }]}
                onPress={handleOpenScanner}
              >
                <BarcodeIcon width={24} height={24} fill={theme.primary} />
                <Text style={[styles.scanButtonText, { color: theme.primary }]}>
                  {t("scanBarcode")}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}

        <Text style={[styles.label, { color: theme.text }]}>
          {t("product")}
        </Text>
        <FormInput
          ref={productInputRef}
          containerOnLayout={() =>
            measureViewInWindow(productInputRef, setProductInputRect)
          }
          labelValue={name}
          onChangeText={handleChangeName}
          placeholderText={t("productPlaceholder")}
          Icon={ShoppingBasketIcon}
          autoCapitalize="sentences"
          underlineColorAndroid="transparent"
          error={errors.name}
          showError={!!errors.name}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          {t("expirationDate")}
        </Text>
        <FormInput
          ref={dateInputRef}
          containerOnLayout={() =>
            measureViewInWindow(dateInputRef, setDateInputRect)
          }
          labelValue={date}
          onChangeText={handleDatePress}
          placeholderText={t("datePickerPlaceholder")}
          Icon={CalendarIcon}
          editable={!showDatePicker}
          onFocus={handleDatePress}
          error={errors.date}
          showError={!!errors.date}
        />
        <DateTimePickerModal
          date={new Date(initPickerDate)}
          isVisible={showDatePicker}
          mode="date"
          onConfirm={handleDatePicked}
          onCancel={handleDatePickerHide}
        />
        <Text style={[styles.label, { color: theme.text }]}>
          {t("location")}
        </Text>
        <View
          ref={placePickerRef}
          onLayout={() =>
            measureViewInWindow(placePickerRef, setPlacePickerRect)
          }
        >
          <PlacePicker
            selectedPlace={place}
            onPlaceChange={handlePlaceChange}
            error={errors.place}
            Icon={FridgeIcon}
          />
        </View>
        <Text style={[styles.label, { color: theme.text }]}>
          {t("quantity")}
        </Text>
        <FormInput
          labelValue={quantity}
          onChangeText={handleChangeQuantity}
          placeholderText={t("quantityPlaceholder")}
          Icon={LayersIcon}
          keyboardType="numeric"
          returnKeyType="done"
          error={errors.quantity}
          showError={!!errors.quantity}
        />
        <View style={styles.buttonContainer}>
          <Button
            ref={saveButtonRef}
            onLayout={() =>
              measureViewInWindow(saveButtonRef, setSaveButtonRect)
            }
            text={params?.id ? t("modify") : t("add")}
            onPress={handleSubmit}
            variant="primary"
            disabled={isSubmitting}
          />
          <Button
            text={params?.id ? t("delete") : t("cancel")}
            onPress={params?.id ? handleDelete : navigateToList}
            variant="danger"
            disabled={isDeleting}
          />
        </View>
      </ScrollView>

      <BarcodeScanner
        visible={showScanner}
        onClose={handleCloseScanner}
        onBarcodeScanned={handleBarcodeScanned}
      />

      <AppTutorialCoachmark
        visible={Boolean(isFormTutorialActive)}
        title={tutorialCopy.title}
        description={tutorialCopy.description}
        targetRect={tutorialCopy.targetRect}
        stepNumber={tutorialStep + 1}
        totalSteps={7}
        onNext={handleTutorialNext}
        onBack={handleTutorialBack}
        onSkip={handleTutorialSkip}
        backLabel={t("appTutorialBack")}
        skipLabel={t("appTutorialSkip")}
        nextLabel={t("appTutorialNext")}
        doneLabel={t("appTutorialDone")}
        highlightPadding={6}
      />
    </KeyboardAvoidingView>
  );
};

export default ProductForm;
