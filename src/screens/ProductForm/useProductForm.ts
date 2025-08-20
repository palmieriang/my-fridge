import { useCallback, useState } from "react";
import { Alert } from "react-native";

import { validateProductWithErrors } from "./validateProduct";
import type { NewProduct } from "../../store/types";
import { convertToCustomFormat, convertToISODateString } from "../../utils";

type UseProductFormProps = {
  existingProduct?: {
    name: string;
    date: string;
    place: "fridge" | "freezer";
  };
  existingId?: string;
  userID: string;
  t: (key: string) => string;
  onSuccess: () => void;
  productsContext: {
    handleSaveProduct: (data: NewProduct) => Promise<void>;
    handleModifyProduct: (data: NewProduct, id: string) => Promise<void>;
    handleDeleteProduct: (id: string) => Promise<void>;
  };
};

export const useProductForm = ({
  existingProduct,
  existingId,
  userID,
  t,
  onSuccess,
  productsContext,
}: UseProductFormProps) => {
  const [name, setName] = useState(existingProduct?.name || "");
  const [date, setDate] = useState(existingProduct?.date || "");
  const [place, setPlace] = useState<"fridge" | "freezer" | "">(
    existingProduct?.place || "",
  );
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{
    name?: string;
    date?: string;
    place?: string;
  }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const initPickerDate = existingProduct?.date
    ? convertToISODateString(existingProduct.date)
    : new Date();

  const handleChangeName = useCallback(
    (value: string) => {
      setName(value);
      if (errors.name) {
        setErrors((prev) => ({ ...prev, name: undefined }));
      }
    },
    [errors.name],
  );

  const handleDatePress = useCallback(() => {
    setShowDatePicker(true);
  }, []);

  const handleDatePicked = useCallback(
    (pickedDate: Date) => {
      setDate(convertToCustomFormat(pickedDate));
      setShowDatePicker(false);
      if (errors.date) {
        setErrors((prev) => ({ ...prev, date: undefined }));
      }
    },
    [errors.date],
  );

  const handleDatePickerHide = useCallback(() => {
    setShowDatePicker(false);
  }, []);

  const handlePlaceChange = useCallback(
    (itemValue: "fridge" | "freezer" | "") => {
      setPlace(itemValue);
      if (errors.place) {
        setErrors((prev) => ({ ...prev, place: undefined }));
      }
    },
    [errors.place],
  );

  const handleSubmit = useCallback(async () => {
    setErrors({});
    setIsSubmitting(true);

    const validation = validateProductWithErrors({ name, date, place, t });

    if (!validation.isValid) {
      setErrors(validation.errors);
      setIsSubmitting(false);
      return;
    }

    const data: NewProduct = {
      name: name.trim(),
      date,
      place: place as "fridge" | "freezer",
      authorID: userID,
    };

    try {
      if (existingId) {
        await productsContext.handleModifyProduct(data, existingId);
      } else {
        await productsContext.handleSaveProduct(data);
      }
      onSuccess();
    } catch (error) {
      console.error("Error saving product:", error);
      Alert.alert(t("validationError"), t("productSaveError"));
    } finally {
      setIsSubmitting(false);
    }
  }, [name, date, place, t, userID, existingId, onSuccess, productsContext]);

  const handleDelete = useCallback(async () => {
    if (!existingId) {
      onSuccess();
      return;
    }

    setIsDeleting(true);
    try {
      await productsContext.handleDeleteProduct(existingId);
      onSuccess();
    } catch (error) {
      console.error("Error deleting product:", error);
      Alert.alert(t("validationError"), "Failed to delete product");
    } finally {
      setIsDeleting(false);
    }
  }, [existingId, onSuccess, productsContext, t]);

  return {
    // State
    name,
    date,
    place,
    showDatePicker,
    errors,
    isSubmitting,
    isDeleting,
    initPickerDate,

    // Handlers
    handleChangeName,
    handleDatePress,
    handleDatePicked,
    handleDatePickerHide,
    handlePlaceChange,
    handleSubmit,
    handleDelete,
  };
};
