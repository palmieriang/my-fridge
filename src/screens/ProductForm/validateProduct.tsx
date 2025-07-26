import { Alert } from "react-native";

import { convertToISODateString } from "../../utils";

type ValidateProductProps = {
  name: string;
  date: string | null;
  place: string;
  t: (key: string) => string;
};

type ValidationResult = {
  isValid: boolean;
  errors: {
    name?: string;
    date?: string;
    place?: string;
  };
};

const isValidPlace = (p: string): p is "fridge" | "freezer" =>
  p === "fridge" || p === "freezer";

const isValidDate = (dateString: string | null): boolean => {
  if (!dateString) return false;

  console.log("[Validation] Checking date:", dateString);

  try {
    const isoString = convertToISODateString(dateString);
    const date = new Date(isoString);
    const isValid = !isNaN(date.getTime());
    return isValid;
  } catch {
    const date = new Date(dateString);
    const isValid = !isNaN(date.getTime());
    return isValid;
  }
};

export const validateProduct = ({
  name,
  date,
  place,
  t,
}: ValidateProductProps): boolean => {
  const result = validateProductWithErrors({ name, date, place, t });

  if (!result.isValid) {
    const firstError = Object.values(result.errors)[0];
    if (firstError) {
      Alert.alert(t("validationError"), firstError);
    }
  }

  return result.isValid;
};

export const validateProductWithErrors = ({
  name,
  date,
  place,
  t,
}: ValidateProductProps): ValidationResult => {
  const errors: ValidationResult["errors"] = {};

  // Name validation
  if (!name.trim()) {
    errors.name = t("nameRequired");
  } else if (name.trim().length < 3) {
    errors.name = t("nameLength");
  } else if (name.trim().length > 50) {
    errors.name = t("nameTooLong");
  }

  // Date validation
  if (!date) {
    errors.date = t("selectDate");
  } else if (!isValidDate(date)) {
    errors.date = t("invalidDate");
  } else {
    try {
      // Check if date is not too far in the past (more than 1 year ago)
      const isoString = convertToISODateString(date);
      const selectedDate = new Date(isoString);
      const oneYearAgo = new Date();
      oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

      if (selectedDate < oneYearAgo) {
        errors.date = t("dateTooOld");
      }
    } catch {
      // If conversion fails, skip the old date check
      // The date is valid but we can't check if it's too old
    }
  }

  // Place validation
  if (!isValidPlace(place)) {
    errors.place = t("selectPlace");
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};
